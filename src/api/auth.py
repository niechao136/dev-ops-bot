from typing import Annotated
from fastapi import APIRouter, Depends, Body

from src.database.postgre import get_db_pool
from src.schemas.api import DataResult
from src.schemas.auth import UserLogin, TokenDict
from src.utils.jwt import create_access_token
from src.utils.security import pwd_context


auth_router = APIRouter(
    prefix="/auth",
    tags=["Auth 模块"]
)


@auth_router.post(
    path="/login",
    response_model=DataResult[str],
    summary="用户登录",
    description="验证用户名和密码，成功后返回 JWT Token。如果当前浏览器存在匿名会话，会自动合并至登录账号。",
)
async def login(
    user: Annotated[UserLogin, Body(description="用户登录凭证")],
    pool= Depends(get_db_pool),
):
    async with pool.connection() as conn:
        async with conn.transaction():
            cur = await conn.execute(
                "SELECT id, username, password, role FROM users WHERE username = %s",
                (user.username,)
            )
            row = await cur.fetchone()

    if not row or not pwd_context.verify(user.password, row["password"]):
        return DataResult(status=0, msg="Username or password is incorrect")

    user_id = str(row["id"])
    token = create_access_token(TokenDict(id=user_id, name=user.username, role=row["role"]))
    return DataResult(status=1, data=token)

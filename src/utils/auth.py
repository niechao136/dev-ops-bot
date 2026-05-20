from fastapi import Depends, HTTPException, Header, status
from typing import Annotated, List
from pydantic import ValidationError

from src.schemas.auth import TokenDict, UserRole
from src.utils.jwt import verify_access_token


ALLOW_ROLE: List[UserRole] = [UserRole.ADMIN]


async def get_current_user(
        authorization: Annotated[str, Header()] = None
) -> TokenDict:
    """
    从请求头 Authorization: Bearer <token> 获取当前用户
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"})

    token = authorization[7:]
    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalid or expired")

    try:
        return TokenDict(**payload)
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token data corrupted"
        )


async def get_current_admin(
        current_user: Annotated[TokenDict, Depends(get_current_user)]
) -> TokenDict:
    if current_user.role not in ALLOW_ROLE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Permission denied. Required roles: {ALLOW_ROLE}")
    return current_user

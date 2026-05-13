import subprocess
from langchain_core.tools import tool
from typing import Optional


@tool
def list_managed_projects():
    """
    列出当前系统管理的所有项目及其描述。
    """
    return []


@tool
def execute_project_update(project_id: str, version: Optional[str] = None):
    """
    执行指定项目的更新任务。
    参数:
    - project_id: 项目在配置中的唯一键名（如 'dify', 'ai-bot'）。
    - version: 可选的版本号或 Git Tag。如果项目命令包含 {version} 占位符则必填。
    """
    try:
        config = {}
        cmd_template = config.get("update_cmd", "")
        path = config.get("path", "")

        # 处理版本号替换
        if "{version}" in cmd_template:
            if not version:
                return f"项目 {project_id} 的更新需要指定版本号（例如 v1.0.0）。"
            final_cmd = cmd_template.format(version=version)
        else:
            final_cmd = cmd_template

        # 执行命令
        process = subprocess.run(
            args=final_cmd,
            cwd=path,
            shell=True,
            capture_output=True,
            text=True,
            timeout=300
        )

        if process.returncode == 0:
            return f"✅ 项目 {project_id} 更新成功！\n输出摘要: {process.stdout[-200:]}"
        else:
            return f"❌ 更新失败！\n错误信息: {process.stderr}"

    except Exception as e:
        return f"❌ 执行过程中发生异常: {str(e)}"
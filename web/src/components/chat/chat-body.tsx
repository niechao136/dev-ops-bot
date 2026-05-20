'use client';

import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SettingsIcon from '@mui/icons-material/Settings';
import TerminalIcon from '@mui/icons-material/Terminal';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { MouseEvent, ReactNode, useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import ToggleThemeButton from '@/components/base/toggle-theme';

import { useOwner } from '@/hooks/user-query';
import { useChatStore } from '@/stores/chat';
import { getAvatarText, stringToColor } from '@/utils/string';


const SIDEBAR_WIDTH = 280;


export default function ChatBody({ children }: {
  children: ReactNode;
}) {

  const params = useParams();
  const conversation_id = params.conversation_id as string;

  const setConversationId = useChatStore((s) => s.setConversationId);

  useEffect(() => {
    setConversationId(conversation_id ?? null);
  }, [conversation_id, setConversationId]);

  const { data: owner } = useOwner();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorEl);

  const handleUserClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserClose = () => {
    setAnchorEl(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const historyConversations = [
    { id: '1', title: 'K8s 节点异常排查' },
    { id: '2', title: 'MySQL 慢查询优化日志' },
    { id: '3', title: '部署 Webhook 报错咨询' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* =========================================================================
          1. 左侧边栏 (Sidebar)
          ========================================================================= */}
      <Box
        component="aside"
        sx={{
          width: sidebarOpen ? SIDEBAR_WIDTH : 0,
          flexShrink: 0,
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 【A. Logo 区域】 */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ backgroundColor: 'primary.main', width: 32, height: 32 }}>
                <TerminalIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" sx={{ letterSpacing: 0.5, fontWeight: 'bold' }}>
                DevOps Bot
              </Typography>
            </Box>

            <Tooltip title="收起侧边栏" arrow>
              <IconButton onClick={toggleSidebar} size="small">
                <MenuOpenIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

        {/* 【B. 新对话按钮】 */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              justifyContent: 'flex-start',
              borderRadius: 2,
              textTransform: 'none',
              py: 1,
            }}
            onClick={() => console.log('开启新对话')}
          >
            开启新对话
          </Button>
        </Box>

        {/* 【C. 历史对话列表 (滚动区域)】 */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 2, py: 1, fontWeight: 'bold' }}>
            最近对话
          </Typography>
          <List disablePadding>
            {historyConversations.map((chat) => (
              <ListItem key={chat.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    py: 0.75,
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ChatBubbleOutlinedIcon fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap color="text.primary">
                        {chat.title}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        {/* 【D. 用户信息区域 (点击弹出管理中心)】 */}
        <Box sx={{ p: 1.5 }}>
          <ListItemButton
            onClick={handleUserClick}
            sx={{
              borderRadius: 2,
              p: 1,
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                mr: 1.5,
                // 自动计算背景色
                backgroundColor: stringToColor(owner?.username ?? ''),
                color: '#fff', // 确保白字清晰
                fontSize: '0.95rem',
                fontWeight: 'bold'
              }}
            >
              {/* 自动获取首字母 */}
              {getAvatarText(owner?.username ?? '')}
            </Avatar>

            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <Typography variant="body2" noWrap  sx={{ fontWeight: 'medium' }}>
                {owner?.username ?? ''} ({owner?.role ?? ''})
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {owner?.email ?? ''}
              </Typography>
            </Box>
          </ListItemButton>
        </Box>

        {/* 用户头像点击弹出的悬浮菜单 (MUI Menu) */}
        <Menu
          anchorEl={anchorEl}
          open={openUserMenu}
          onClose={handleUserClose}
          onClick={handleUserClose}
          transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: { width: 180, mb: 1, borderRadius: 2 }
            }
          }}
        >
          <MenuItem onClick={() => console.log('管理中心')}>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <Typography variant="body2">管理中心</Typography>
          </MenuItem>
          <MenuItem onClick={() => console.log('修改密码')}>
            <ListItemIcon><LockResetIcon fontSize="small" /></ListItemIcon>
            <Typography variant="body2">修改密码</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => console.log('登出')} sx={{ color: 'error.main' }}>
            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
            <Typography variant="body2">退出登录</Typography>
          </MenuItem>
        </Menu>

      </Box>

      {/* =========================================================================
          2. 右侧主内容区 (包含页头 + 聊天主体)
          ========================================================================= */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'background.default' }}>

        {/* 【E. 页头 (Header)】 */}
        <Box
          component="header"
          sx={{
            height: 64,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
          }}
        >
          {/* 左侧：展开按钮 + 对话标题 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!sidebarOpen && (
              <Tooltip title="展开侧边栏" arrow>
                <IconButton onClick={toggleSidebar} edge="start" size="small">
                  <MenuIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold' }}>
              当前对话：K8s 节点异常排错
            </Typography>
          </Box>

          {/* 右侧：光暗切换按钮 */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ToggleThemeButton />
          </Box>
        </Box>

        {/* 【F. 聊天内容主体】 */}
        <Box component="main" sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
          {children}
        </Box>

      </Box>

    </Box>
  );

}

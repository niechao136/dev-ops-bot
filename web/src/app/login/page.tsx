'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff, Terminal as TerminalIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';

import { useRouter } from 'next/navigation';

import ToggleThemeButton from '@/components/base/toggle-theme';

import { useAuthAction } from '@/hooks/auth-query';
import { saveToken } from '@/utils/cookie';
import { getRemember, saveRemember } from '@/utils/local';


const formSchema = z.object({
  username: z.string().trim().min(1, { message: '用户名不能为空' }),
  password: z.string().trim().min(1, { message: '密码不能为空' }),
  remember: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;


export default function LoginPage() {

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', password: '', remember: false },
  });

  const { signIn, clearCache } = useAuthAction();
  
  useEffect(() => {
    const { remember, username } = getRemember();
    form.setValue('remember', remember);
    form.setValue('username', username);
  }, [form]);

  async function onSubmit(values: FormValues) {
    const { remember, ...data } = values;
    const body = JSON.stringify(data);
    signIn.mutate(body, {
      onSuccess: async (res) => {
        saveToken(res?.data ?? '');
        saveRemember(remember ? data.username : '');

        await clearCache();

        router.push(`/chat`);
      },
      onError: (err) => {
        enqueueSnackbar(err?.message || '登录失败，请检查账号密码', { variant: 'error' });
      },
    });
  }

  return (
    <Box sx={{
      backgroundColor: 'background.default',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ToggleThemeButton />
      </Box>

      <Container maxWidth={'sm'}>
        <Paper
          elevation={4}
          sx={{
            padding: { xs: 4, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* 系统 Logo & 标题区 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
            <TerminalIcon color="primary" sx={{ fontSize: 36 }} />
            <Typography variant="h4" component="h1" color="text.primary" sx={{ fontWeight: 700 }}>
              DevOps Bot
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            欢迎回来，请输入凭证以管理您的云服务
          </Typography>

          {/* 表单区 */}
          <Box component="form" onSubmit={form.handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
            <Controller
              control={form.control}
              name={'username'}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="请输入用户名"
                  name="username"
                  autoComplete="email"
                  autoFocus
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              )}
            />

            <Controller
              control={form.control}
              name={'password'}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="密码"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="切换密码可见性"
                            onClick={() => setShowPassword(prevState => !prevState)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              )}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
                mb: 2,
              }}
            >
              <Controller
                control={form.control}
                name={'remember'}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox color="primary" checked={field.value} onChange={field.onChange}/>}
                    label={<Typography variant="body2">记住我</Typography>}
                  />
                )}/>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={signIn.isPending}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              {signIn.isPending ? '正在验证...' : '登 录'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );

}

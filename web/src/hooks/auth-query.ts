'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';

import { chatKeys } from '@/hooks/chat-query';
import { login } from '@/services/auth';


export function useAuthAction() {
  const queryClient = useQueryClient();

  const clearCache = async () => {
    await queryClient.invalidateQueries({
      queryKey: chatKeys.all,
      exact: false
    });
  };

  const signIn = useMutation({
    mutationFn: login,
    onSuccess: async (res) => {
      if (res?.status !== 1) {
        throw new Error(res?.msg);
      }
    },
  });

  return {
    clearCache,
    signIn,
  };
}

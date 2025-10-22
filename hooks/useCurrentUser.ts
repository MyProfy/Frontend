import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiClient } from '.././components/types/apiClient';
import { User } from '.././components/types/apiTypes';
import { loginSuccess, logout } from '@/store/slices/authSlice';

interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
  };
}

export const useCurrentUser = () => {
  const dispatch = useDispatch();
  const { user: storeUser, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User | null>(storeUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await apiClient.getCurrentUser();
      console.log('✅ User data fetched:', userData);
      
      setUser(userData);
      
      dispatch(loginSuccess({ 
        token: 'session', 
        user: userData 
      }));
    } catch (err: any) {
      console.error('❌ Failed to fetch user:', err);
      
      if (err.response?.status === 401) {
        dispatch(logout());
        setUser(null);
      }
      
      setError(err.response?.data?.detail || 'Не удалось загрузить данные пользователя');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !storeUser) {
      fetchUser();
    } else {
      setUser(storeUser);
    }
  }, [isAuthenticated, storeUser]);

  const updateUser = async (updates: Partial<User>) => {
    setLoading(true);
    try {
      // Здесь будет API вызов для обновления пользователя
    //   const updatedUser = await apiClient.updateUser(user!.id, updates);
      
      const updatedUser = { ...user, ...updates } as User;
      setUser(updatedUser);
      
      dispatch(loginSuccess({ 
        token: 'session', 
        user: updatedUser 
      }));
      
      return updatedUser;
    } catch (err: any) {
      console.error('❌ Failed to update user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    updateUser,
  };
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface UserData {
    id: string;
    fullName: string;
    email: string;
    avatar: string;
    since: string;
    cpf: string;
    phone: string;
    address: {
        zip: string;
        street: string;
        number: string;
        complement: string;
        district: string;
        city: string;
        state: string;
    };
    stats: {
        totalDonated: number;
        projectsSupported: number;
        nextDonationDate: string;
    };
}

interface UserContextType {
    user: UserData | null;
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id, session.user.email || '');
            } else {
                setIsLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id, session.user.email || '');
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string, email: string) => {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profile) {
                // Fetch real donation stats
                const { data: donations } = await supabase
                    .from('donations')
                    .select('amount, project_id')
                    .eq('user_id', userId)
                    .eq('status', 'confirmado');

                const totalDonated = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
                const uniqueProjects = new Set(donations?.map(d => d.project_id)).size;

                const userData: UserData = {
                    id: userId,
                    fullName: profile.full_name || 'Usuário',
                    email: email,
                    avatar: profile.avatar_url || '/assets/img/user-avatar-default.jpg',
                    since: new Date(profile.created_at || Date.now()).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }),
                    cpf: profile.cpf || '',
                    phone: profile.phone || '',
                    address: {
                        zip: profile.address?.zip || '',
                        street: profile.address?.street || '',
                        number: profile.address?.number || '',
                        complement: profile.address?.complement || '',
                        district: profile.address?.district || '',
                        city: profile.address?.city || '',
                        state: profile.address?.state || ''
                    },
                    stats: {
                        totalDonated,
                        projectsSupported: uniqueProjects,
                        nextDonationDate: '--'
                    }
                };
                setUser(userData);
            }
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    const refreshProfile = async () => {
        if (session) {
            await fetchProfile(session.user.id, session.user.email || '');
        }
    };

    return (
        <UserContext.Provider value={{ user, session, isLoading, signOut, refreshProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
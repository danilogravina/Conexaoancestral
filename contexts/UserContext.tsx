import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
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
    user: UserData;
    updateUser: (data: Partial<UserData>) => void;
}

const defaultUser: UserData = {
    fullName: "Maria Aparecida da Silva",
    email: "maria.silva@email.com",
    avatar: "assets/img/user-avatar-default.jpg",
    since: "Doadora desde 2021",
    cpf: "123.456.789-99",
    phone: "(11) 98765-4321",
    address: {
        zip: "69000-000",
        street: "Av. Eduardo Ribeiro",
        number: "100",
        complement: "Apto 402",
        district: "Centro",
        city: "Manaus",
        state: "AM"
    },
    stats: {
        totalDonated: 1250.00,
        projectsSupported: 3,
        nextDonationDate: "15 Nov"
    }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData>(defaultUser);

    const updateUser = (data: Partial<UserData>) => {
        setUser(prev => ({ ...prev, ...data }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
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
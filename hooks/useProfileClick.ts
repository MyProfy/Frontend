// hooks/useProfileClick.ts
import {useRouter} from "next/navigation"; // или "next/router"
import {Dispatch, SetStateAction, useCallback} from "react";


export const useProfileClick = (
	isAuthenticated: boolean,
	setIsModalOpen: Dispatch<SetStateAction<boolean>>
) => {
	const router = useRouter();

	return useCallback(() => {
		if (isAuthenticated) router.push("/profile");
		else setIsModalOpen(true);
	}, [isAuthenticated, router, setIsModalOpen]);
};

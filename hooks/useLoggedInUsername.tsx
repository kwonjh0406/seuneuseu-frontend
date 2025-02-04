import { useState, useEffect } from "react";
import axios from "axios";

const useLoggedInUsername = () => {
    const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

    useEffect(() => {
        const isLoggedIn = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/username`, {
                    withCredentials: true,
                });
                setLoggedInUsername(response.data.username);
            } catch (error) { }
        };
        isLoggedIn();
    }, []);

    return loggedInUsername;
};

export default useLoggedInUsername;

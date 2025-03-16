import useAuthStore from '@/store/useAuthStore';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

function Logout() {

    const { logoutUser } = useAuthStore();
    const navigate = useNavigate()

    useEffect(() => {
        logoutUser()
        toast.success("Logout successfully!")
        navigate('/')
    }, [])

  return (
    <div>Logout</div>
  )
}

export default Logout
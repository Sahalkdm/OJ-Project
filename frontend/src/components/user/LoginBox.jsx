import React, { useState } from 'react'
import Card from '../Card'
import InputField from '../Input'
import { FaUser, FaLock, FaFacebookF, FaTwitter, FaGoogle, FaEnvelope } from "react-icons/fa";
import Button from '../Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from '../../hooks/AuthProvides';

function LoginBox() {

    const { fetchUser } = useAuth();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/"; // fallback to homepage
    console.log("from: ", from)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const onSubmitHandler = async (e) =>{
    e.preventDefault();
    const data = {email, password};

    try{
      const response = await loginUser(data);
      console.log(response);

      const { success, message } = response;
      if (success) {
        fetchUser();
        handleSuccess(message);
        setTimeout(() => {
          if (from === "/login"){
            navigate('/');
          }else{
            navigate(from, { replace: true });
          }
           // redirect to intended route
        }, 1000);
      } else {
        handleError(message);
      }
     
      setEmail('');
      setPassword('');

    }catch(error){
      console.log("error: ", error)
      handleError(error?.message || "Something went wrong!");
    }
  }

  return (
    <Card className=''>
        <div className="flex w-full md:min-h-[50vh] md:flex-row flex-col ">
            <div className='md:w-1/2'>
                <img src='oj-login-img1.jpg' width={'100%'} className='md:h-full h-40'/>
            </div>
            <div className='md:w-1/2 flex flex-col justify-center items-center space-y-4 pl-3'>
                <h2 className='text-xl font-bold text-gray-800 pb-4'>Sign In</h2>
                <form className='w-full' onSubmit={onSubmitHandler}>
                    <div className='w-full p-2'>
                        <InputField type='text' placeholder={'Email'} icon={FaEnvelope} value={email} setValue={setEmail}/>
                        <InputField type='password' placeholder={'Password'} icon={FaLock} value={password} setValue={setPassword}/>
                    </div>
                    <div>
                        <Button type='submit'>Sign In</Button>
                    </div>
                </form>
                <div className='text-xs text-right w-full text-gray-500'>
                    New User <Link className='text-blue-400 underline' to={'/register'}>Register</Link>
                </div>
            </div>
        </div>
    </Card>
  )
}

export default LoginBox

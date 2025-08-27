import React, { useState } from 'react'
import Card from '../Card'
import InputField from '../Input'
import { FaLock, FaEnvelope } from "react-icons/fa";
import Button from '../Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { login } from '../../store/authSlice';
import { handleError, handleSuccess } from '../../utils/toastFunctions';

function LoginBox() {

    // const { fetchUser } = useAuth();
    const location = useLocation();
    const dispatch = useDispatch();

    const from = location.state?.from?.pathname || "/"; // fallback to homepage
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

  const onSubmitHandler = async (e) =>{
    e.preventDefault();
    const data = {email, password};
    setLoading(true);
    try{
      // const response = await loginUser(data);
      const resultAction = await dispatch(login(data));

      if (login.fulfilled.match(resultAction)) {
        handleSuccess(resultAction.payload.message);

        setTimeout(() => {
          if (from === "/login") {
            navigate("/");
          } else {
            navigate(from, { replace: true });
          }
          setEmail('');
          setPassword('');
        }, 1000);
      } else {
        handleError(resultAction.payload?.message || "Login failed");
      }

      // console.log(response);

      // const { success, message } = response;
      // if (success) {
      //   fetchUser();
      //   handleSuccess(message);
      //   setTimeout(() => {
      //     if (from === "/login"){
      //       navigate('/');
      //     }else{
      //       navigate(from, { replace: true });
      //     }
      //      // redirect to intended route
      //   }, 1000);
      // } else {
      //   handleError(message);
      // }

    }catch(error){
      handleError(error?.message || "Something went wrong!");
    }finally{
      setLoading(false);
    }
  }

  return (
    <Card className='dark:bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:text-gray-100 dark:shadow-gray-800'>
        <div className="flex w-full md:min-h-[50vh] md:flex-row flex-col ">
            <div className='md:w-1/2'>
                <img src='oj-login-img1.jpg' width={'100%'} className='md:h-full h-40'/>
            </div>
            <div className='md:w-1/2 flex flex-col justify-center items-center space-y-4 pl-3'>
                <img src='/myCoddyLogo.png' alt='myCoddy' width={100} height={30}/>
                <h2 className='text-xl font-bold text-gray-800 dark:text-gray-50 pb-4'>Sign In</h2>
                <form className='w-full' onSubmit={onSubmitHandler}>
                    <div className='w-full p-2'>
                        <InputField type='text' placeholder={'Email'} icon={FaEnvelope} value={email} setValue={setEmail}/>
                        <InputField type='password' placeholder={'Password'} icon={FaLock} value={password} setValue={setPassword}/>
                    </div>
                    <div className='text-center'>
                        <Button disabled={loading} type='submit' className='dark:bg-violet-600'>{loading ? "Signing In..." : "Sign In"}</Button>
                    </div>
                </form>
                <div className='text-xs text-right w-full text-gray-500 dark:text-gray-300'>
                    New User <Link className='text-blue-400 underline' to={'/register'}>Register</Link>
                </div>
            </div>
        </div>
    </Card>
  )
}

export default LoginBox

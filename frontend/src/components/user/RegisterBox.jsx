import React, { useState } from 'react'
import Card from '../Card'
import InputField from '../Input'
import { FaUser, FaLock, FaPhone, FaEnvelope } from "react-icons/fa";
import Button from '../Button';
import { registerUser } from '../../api/authApi';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../utils/toastFunctions';

function RegisterBox() {

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) =>{
    e.preventDefault();
    const data = {firstname, lastname, email, phone, password};
    setLoading(true);
    try{
      const response = await registerUser(data);
      if (response.success){
        setFirstname('');
        setLastname('');
        setEmail('');
        setPassword('');
        setCnfPassword('');
        setPhone('');

        handleSuccess(response.message)
        navigate('/login');
      }else{
        handleError(response.message)
      }
    }catch(error){
      handleError(error?.message || "Error while registering, Please try again later")
    }finally{
      setLoading(false);
    }
  }

  return (
    <Card className='h-fit w-full dark:bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:text-gray-100 dark:shadow-gray-700'>
        <div className="flex w-full flex-col items-center min-w-md">
                <img src='/myCoddyLogo.png' alt='myCoddy' width={100} height={30}/>
                <h2 className='text-xl font-bold text-gray-800 dark:text-gray-50 p-4'>Register</h2>
                <form className='w-full' onSubmit={onSubmitHandler}>
                  <div className="w-full flex md:flex-row flex-col gap-3">
                    <InputField type='text' placeholder={'First Name'} icon={FaUser} value={firstname} setValue={setFirstname} required={true}/>
                    <InputField type='text' placeholder={'Last Name'} value={lastname} setValue={setLastname} required={true}/>
                  </div>

                  <div className='w-full p-2'>
                      <InputField type='email' placeholder={'Email'} icon={FaEnvelope} value={email} setValue={setEmail} required={true}/>
                      <InputField type='tel' placeholder={'Phone'} icon={FaPhone} value={phone} setValue={setPhone} required={true}/>
                  </div>

                  <div className='w-full p-2'>
                      <InputField type='password' placeholder={'Password'} icon={FaLock} value={password} setValue={setPassword} required={true}/>
                      <InputField type='password' placeholder={'Confirm Password'} icon={FaLock} value={cnfPassword} setValue={setCnfPassword} required={true}/>
                  </div>

                  <div className='p-3 text-center'>
                      <Button disabled={password != cnfPassword || loading} type='submit' className='dark:bg-violet-600 bg-blue-600 text-white'>{loading ? "Saving..." : 'Register'}</Button>
                  </div>
                </form>
            </div>

            <div className='flex gap-1 justify-end text-sm'>
              <p>Already have accout? </p><Link className='hover:underline text-blue-600 dark:text-blue-300' to={'/login'}>Login</Link>
            </div>
    </Card>
  )
}

export default RegisterBox

import React, { useState } from 'react'
import Card from '../Card'
import InputField from '../Input'
import { FaUser, FaLock, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";
import Button from '../Button';
import { registerUser } from '../../api/authApi';
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';

function RegisterBox() {

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');

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
    const data = {firstname, lastname, email, phone, password};

    try{
      const response = await registerUser(data);
      console.log(response);

      setFirstname('');
      setLastname('');
      setEmail('');
      setPassword('');
      setCnfPassword('');
      setPhone('');

      navigate('/login');
    }catch(error){
      console.log("error: ", error)
    }
    
  }

  return (
    <Card className='h-fit w-full dark:bg-gray-700 dark:text-gray-100'>
        <div className="flex w-full flex-col items-center min-w-md">
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
                      <Button disabled={password != cnfPassword} type='submit' className='dark:bg-violet-600'>Register</Button>
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

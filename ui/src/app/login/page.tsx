'use client'

import React, { useState } from "react";
import axios from "axios";
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Login: React.FC = () => {
  const BASE_URL = "http://localhost:8000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const router = useRouter();


  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      console.log("this is the response", response, response.status);

      if(response.status === 200){
        console.log('authentication successfull')
        router.push('/profile')
      }
      else{
        console.log('authentication failed')
      }

    } catch (error) {
      console.log("this is authentication error", error);
      setError("Authentication Failed");
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
      <section className="flex w-[30rem] flex-col space-y-10">
        <div className="text-center text-4xl font-medium">Log In</div>

        <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="text"
            placeholder="Email or Username"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
          />
        </div>

        <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
          />
        </div>

        <button
          onClick={handleLogin}
          className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
        >
          LOG IN
        </button>

        <a
          href="#"
          className="transform text-center font-semibold text-gray-500 duration-300 hover:text-gray-300"
        >
          FORGOT PASSWORD?
        </a>

        <p className="text-center text-lg">
          No account?
          <a
            href="#"
            className="font-medium text-indigo-500 underline-offset-4 hover:underline"
          >
            Create One
          </a>
        </p>
      </section>
    </main>
  );
};

export default Login;

"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="bg-neutral-600 p-4 flex flex-col">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border"
        />
      </div>
      <Button>Login</Button>
    </section>
  );
};

export default LoginPage;

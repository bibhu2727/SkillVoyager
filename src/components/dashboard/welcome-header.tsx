"use client";

import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export function WelcomeHeader({ name }: { name: string }) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(format(new Date(), 'EEEE, MMMM do'));
  }, []);

  return (
    <div className="space-y-2 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Welcome Back, {name}!
      </h1>
      <p className="text-muted-foreground">
        {currentDate ? `Today is ${currentDate}. Let's map out your future.` : `Let's map out your future.`}
      </p>
    </div>
  );
}

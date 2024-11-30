import { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer } from 'recharts';

import React from 'react'

const MonthlyGraph = () => {
    const data = [
        {
          Month: 'Page A',
          Total: 1000,
        },
        {
          Month: 'Page B',       
          Total: 2210,
        },
        {
          Month: 'Page C',          
          Total: 500,
        },
        {
          Month: 'Page D',          
          Total: 1000,
        },
        {
          Month: 'Page E',         
          Total: 2181,
        },
        {
          Month: 'Page F',          
          Total: 2500,
        },
        {
          Month: 'Page G',
          Total: 2100,
        },
      ];
  return (
    <div className='relative p-2 xsm:h-[100%] xsm:w-[100%]'>
        <div className=' xsm:h-[100%] xsm:w-[100%]  rounded border-2 border-gray-300 hover:shadow-lg cursor-pointer '>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart width={100} height={200} data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="Month" tick={{ fontSize: 12 }}/>
                    <YAxis tick={{ fontSize: 12 }}/>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="Total" stroke="#8884d8" fillOpacity={1} fill="url(#total)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  )
}
//mmvml

export default MonthlyGraph

'use client';

import Link from "next/link";
import Image from "next/image";

export type Order = {
  id: string;
  title: string;
  size: string;
  total: number;
  date: string;
  status: 'Delivered' | 'Cancelled';
  image: string;
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm">
    {/* Order Header */}
    <div className="flex flex-col sm:flex-row justify-between gap-2 p-4 sm:p-6 border-b border-gray-200">
      <p className="text-sm sm:text-base">Order ID - {order.id}</p>
      <p className="text-sm sm:text-base font-medium">Grand Total - ₹{order.total}</p>
    </div>

    {/* Order Details */}
    <div className="flex flex-col sm:flex-row p-4 sm:p-6 border-b border-gray-200 gap-4">
      {/* Order Image */}
      <div className="relative flex-shrink-0 rounded-xl overflow-hidden w-full sm:w-auto sm:mr-6">
        <Image src="/assets/images/order-img.png" width={200} height={150} alt="Order Image" className="w-full sm:w-[200px] h-auto" />
      </div>

      {/* Order Info */}
      <div className="flex flex-col sm:flex-row w-full justify-between sm:items-center gap-3 sm:gap-0">
        <div className="max-w-2xl">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-gray-800 leading-snug">{order.title}</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">{order.size}</p>
        </div>
        <div>
          <p className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-[rgba(33,150,83,1)] font-['Open_Sans']">
            ₹{order.total}.00
          </p>
        </div>
      </div>
    </div>

    {/* Order Status & Button */}
    <div className="flex-1 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-1">
        <p className="text-xs sm:text-sm flex items-center text-gray-400">
          <span
            className={`text-xs font-medium w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] mr-2 inline-block rounded-full ${
              order.status === "Delivered" ? "text-green-600 bg-green-500" : "text-red-600 bg-red-500"
            }`}
          />
          {order.status} on {order.date}
        </p>
        <Link href={`order/${order.id}`}>
          <button className="cursor-pointer px-3 sm:px-4 py-2 text-sm sm:text-base text-blue-500 font-normal transition hover:underline">
            View Order Details
          </button>
        </Link>
      </div>
    </div>
  </div>
  );
}

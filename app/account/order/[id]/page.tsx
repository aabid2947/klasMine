import { Order } from "@/app/account/order/OrderCard";

type PageProps = {
  params: Promise<{ id: string }>;  // params is awaited because it may be a Promise
};

const dummyOrders: Order[] = [
  {
    id: "8596-854621-8546",
    title: "8 Terracotta Warli Handpainted Pots With Sheesham Wooden Frame Wall Hanging",
    size: "50 x 40 inches",
    total: 1105,
    date: "Apr 1, 2025",
    status: "Delivered",
    image: "/assets/images/order-img.png",
  },
  {
    id: "1234-5678-9012",
    title: "Handmade Wooden Elephant Statue",
    size: "10 x 8 inches",
    total: 499,
    date: "Apr 5, 2025",
    status: "Cancelled",
    image: "/assets/images/order-img.png",
  },
];

export default async function OrderDetailPage(props: PageProps) {
  const params = await props.params;  // Await here
  const id = params.id;

  const order = dummyOrders.find((o) => o.id === id);

  if (!order) {
    return <p className="p-10 text-red-500">Order not found</p>;
  }



  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 border text-sm text-gray-800">
      <div className="flex justify-between items-center border-b pb-3 text-sm">
        <span className="text-gray-600 font-medium">Order ID - #{order.id}</span>
        <span className="text-gray-700 font-semibold">Grand Total - ₹{order.total.toFixed(2)}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6 border-b pb-6">
        <img
          src={order.image}
          alt={order.title}
          className="w-60 h-auto rounded-lg mt-4"
        />

        <div className="flex-1 space-y-2">
          <h2 className="text-base font-semibold">{order.title}</h2>
          <p>
            <span className="text-gray-500">Size :</span>{" "}
            <span className="font-medium">{order.size}</span>
          </p>
        </div>

        <div className="text-green-600 text-xl font-bold whitespace-nowrap">
          ₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-base">Shipping Address</h3>
          <p>Ankit Sharma</p>
          <p>+91 7042094710</p>
          <p>
            212, 2nd Floor, Aggarwal Cyber Plaza, Netaji Subash Place, New Delhi-110034
          </p>

          <div className="mt-4">
            <h3 className="font-semibold">Payment Method</h3>
            <div className="flex items-center gap-2 mt-1">
              <img
                src="/assets/images/icon/logo-mastercard.png"
                alt="MasterCard"
                width={24}
                height={24}
              />
              <span>xxxx xxxx xxxx 8596</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-green-600 font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Delivered on {order.date}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-base mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Item(s) Subtotal</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-₹0.00</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t mt-2">
              <span>Grand Total</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

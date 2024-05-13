"use client"

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Modal} from "antd";
import {IoRefreshOutline} from "react-icons/io5";
import Link from "next/link";
import Loader from "@/components/common/Loader";
import OrderInfo from "@/types/OrderInfo";


interface OrderRowProps extends OrderInfo {
  shopNameId: string;
}

function OrdersRow({id, quantity, total, status, product, createdAt, customer}: OrderRowProps) {
  const [remove, setRemove] = useState(false);
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleString();

  const ModalFooter = () => {
    return (
      <div className={"flex flex-row-reverse gap-3"}>
        {/* <button onClick={handleRemove} className={"bg-danger rounded-lg px-4 py-2 text-white font-bold hover:bg-opacity-80"}>Remove</button> */}
        <button onClick={() => setRemove(false)}
                className={"border border-primary rounded-lg px-4 py-2 text-primary font-bold hover:bg-opacity-80"}>Cancel
        </button>
      </div>
    )
  }


  const ActionButton = () => {
    switch (status) {
      case "ordered":
        return <td
          className={"whitespace-nowrap font-medium px-1 py-2 text-black hover:text-danger dark:text-white dark:hover:text-danger cursor-pointer"}>
          Take order
        </td>
      case "incart":
        return <td
          className={"whitespace-nowrap font-medium px-1 py-2 text-neutral-400 dark:text-neutral-500"}>
          No action
        </td>
      case "shipping":
        return <td
          className={"whitespace-nowrap font-medium px-1 py-2 text-neutral-400 dark:text-neutral-500"}>
          No action
        </td>
      case "completed":
        return null;
      default:
        return <td
          className={"whitespace-nowrap font-medium px-1 py-2 text-black hover:text-danger dark:text-white dark:hover:text-danger cursor-pointer"}>
          Take order
        </td>
    }
  }

  return (
    <tr>
      <Modal footer={<ModalFooter/>} title={<h1 className={"text-danger font-bold text-2xl"}>Remove product</h1>}
             open={remove} onOk={() => {
      }} onCancel={() => {
        setRemove(false)
      }}>
        <p className={"text-black-2 text-lg"}>Are you sure you want to remove this orders?</p>
        <p className={"text-black-2 text-lg"}>This action can't be undo</p>
      </Modal>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>
        <div title={id} className={"truncate w-30"}>
          {id}
        </div>
      </td>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{product.displayName}</td>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{quantity}</td>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{total}</td>
      <td className={"whitespace-nowrap font-medium pl-4 py-2 text-black dark:text-white"}>{status}</td>
      <td className={"whitespace-nowrap font-medium pl-4 py-2 text-black dark:text-white"}>{formattedDate}</td>
      <td className={"whitespace-nowrap font-medium pl-4 py-2 text-black dark:text-white"}>{customer.username}</td>

      <ActionButton/>

      <td
        className={"whitespace-nowrap font-medium px-1 pr-4 py-2 text-black hover:text-meta-6 dark:text-white dark:hover:text-meta-6 cursor-pointer"}>
        <Link href={`./order/${id}`}>
          Detail
        </Link>
      </td>
    </tr>
  )
}


interface OrderTableProps {
  orders: OrderInfo[];
  shopNameId: string;
}

function OrderTable({orders, shopNameId}: OrderTableProps) {
  return (
    <div className={"border border-strokedark rounded-md dark:border-gray-3"}>
      <table className={"w-full divide-y divide-strokedark dark:divide-gray-3 rounded-md"}>
        <thead className={"text-primary dark:text-meta-3 font-extrabold text-lg"}>
        <tr className={"text-left"}>
          <th className={"px-4 py-2"}>Order ID</th>
          <th className={"px-4 py-2"}>Product</th>
          <th className={"px-4 py-2"}>Quantity</th>
          <th className={"px-4 py-2"}>Total</th>
          <th className={"px-4 py-2"}>Status</th>
          <th className={"pl-4 py-2"}>Created At</th>
          <th className={"px-4 py-2"}>Customer</th>
          <th className={"px-1 py-2"}></th>
          <th className={"px-1 py-2 pr-4"}></th>
        </tr>
        </thead>

        <tbody className={"divide-y divide-strokedark dark:divide-gray-3"}>
        {orders.map((order, key) => (
          <OrdersRow shopNameId={shopNameId} key={key} {...order}/>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default function OrderList() {
  const params = useParams();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const limit = 5;
  const orderby = "createdAt";
  const status = "all";

  useEffect(() => {
    fetchData();
  }, [params.id, page]);

  const fetchData = () => {
    setLoading(true);
    const data = fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/order?limit=${limit}&shop=${params.id}&offset=${(page - 1) * limit}&orderby=${orderby}&status=${status}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: "include"
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    data.then((data) => {
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setLoading(false);
    });
  }

  if (loading) {
    return (
      <div>
        <h1 className={"text-3xl text-black-2 dark:text-white font-bold mb-5"}>Order list</h1>
        <Loader/>
      </div>
    )
  }
  return (
    <div
      className={"rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark"}>
      <h1 className={"text-3xl text-black-2 dark:text-white font-bold mb-5"}>Order list</h1>

      {orders.length === 0 ?
        <p className={"text-black-2 dark:text-white"}>It looks like you don't have any orders</p> :
        <div className={"flex flex-col gap-5"}>
          <div className={"flex flex-row"}>

            <div className={"bg-primary py-1 px-2 rounded-md hover:bg-opacity-80 cursor-pointer"}>
              <IoRefreshOutline onClick={() => {
                setPage(1);
                fetchData();
              }} className={"text-white"} fontSize={25}/>
            </div>
          </div>

          <OrderTable shopNameId={params.id as string} orders={orders}/>
          <div className={"flex flex-row justify-between items-center"}>
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className={"bg-primary text-white rounded-md px-4 py-2 disabled:bg-bodydark1 disabled:text-black"}>Previous
              page
            </button>

            <p className={"text-black-2 dark:text-white"}>Page {page} of {totalPages}</p>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              className={"bg-primary text-white rounded-md px-4 py-2 disabled:bg-bodydark1 disabled:text-black"}>Next
              page
            </button>
          </div>
        </div>
      }
    </div>
  )
}
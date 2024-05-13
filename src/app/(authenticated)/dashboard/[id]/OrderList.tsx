"use client"

import {useParams} from "next/navigation";
import {useState} from "react";
import {Modal} from "antd";
import {IoRefreshOutline} from "react-icons/io5";
import Link from "next/link";

interface Product {
  id: number;
  displayName: string;
  stock: number;
  price: number;
  createdAt: string;
}

interface Order {
  id: number;
  product: Product;
  quantity: number;
  total: number;
  status: string;
  createdAt: string;
  customer: string;
}

interface OrderRowProps extends Order {
  shopNameId: string;
}

function OrdersRow({id, quantity, total, status, product, createdAt, customer}: OrderRowProps) {
  const [remove, setRemove] = useState(false);
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleString();

//   const handleRemove = () => {
//     fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/product/${id}`, {
//       method: 'DELETE',
//       headers: {'Content-Type': 'application/json'},
//       credentials: 'include'
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to delete product");
//         }
//         const storage = getStorage();
//         const userId = auth.currentUser?.uid;
//         const productRef = ref(storage, `/public/${userId}/${shopNameId}/products/${id}`);
//         listAll(productRef)
//           .then((res) => {
//             res.items.forEach((itemRef) => {
//               deleteObject(itemRef).then(() => {
//                 console.log("Deleted successfully");
//               }).catch((error) => {
//                 console.error("Error deleting", error);
//               });
//             });
//             setRemove(false);
//           })
//           .catch((error) => {
//             console.error("Error listing", error);
//           });
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   }

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
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{id}</td>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{product.displayName}</td>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{quantity}</td>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{total}</td>
      <td className={"whitespace-nowrap font-medium pl-4 py-2 text-black dark:text-white"}>{status}</td>
      <td className={"whitespace-nowrap font-medium pl-4 py-2 text-black dark:text-white"}>{createdAt}</td>
      <td className={"whitespace-nowrap font-medium pl-4 py-2 text-black dark:text-white"}>{customer}</td>
      <td
        className={"whitespace-nowrap font-medium px-1 py-2 text-black hover:text-danger dark:text-white dark:hover:text-danger cursor-pointer"}>
        Button
      </td>
      <Link href={`./product/${product.id}`}>
        <td
          className={"whitespace-nowrap font-medium px-1 py-2 text-black hover:text-meta-6 dark:text-white dark:hover:text-meta-6 cursor-pointer"}>
          Detail
        </td>
      </Link>
      <td onClick={() => setRemove(true)}
          className={"whitespace-nowrap font-medium px-1 py-2 text-black hover:text-danger dark:text-white dark:hover:text-danger cursor-pointer"}>
        Delete
      </td>
    </tr>
  )
}


interface OrderTableProps {
  orders: Order[];
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
          <th className={"px-1 py-2"}></th>
          <th className={"px-1 py-2"}></th>
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
  const product = {
    id: 1,
    displayName: "Test product",
    stock: 2,
    price: 20,
    createdAt: "121"
  };
  const orders = [
    {id: 1, quantity: 2, total: 19, product: product, status: "processing", createdAt: "15-03-2024", customer: "Duc"},
    {id: 2, quantity: 2, total: 19, product: product, status: "processing", createdAt: "15-03-2024", customer: "Duc"}
  ];
  const params = useParams();
  //const [products, setProducts] = useState<Product[]>([]);
  //const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;

  // useEffect(() => {
  //     fetchData();
  // }, [params.id, page]);

  // const fetchData = () => {
  //     setLoading(true);
  //     const data = fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/product?limit=${limit}&shop=${params.id}&offset=${(page - 1) * limit}`, {
  //     method: 'GET',
  //     headers: {'Content-Type': 'application/json'}
  //     })
  //     .then((response) => {
  //         if (response.ok) {
  //         return response.json();
  //         }
  //     })
  //     .catch((error) => {
  //         console.error('Error:', error);
  //     });
  //     data.then((data) => {
  //     setProducts(data.products);
  //     setTotalPages(data.totalPages);
  //     setLoading(false);
  //     });
  // }

  // if (loading) {
  //     return (
  //     <div>
  //         <h1 className={"text-3xl text-black-2 dark:text-white font-bold mb-5"}>Order list</h1>
  //         <Loader/>
  //     </div>
  //     )
  // }
  return (
    <div
      className={"rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark"}>
      <h1 className={"text-3xl text-black-2 dark:text-white font-bold mb-5"}>Order list</h1>

      {orders.length === 0 ?
        <p className={"text-black-2 dark:text-white"}>It looks like you don't have any products</p> :
        <div className={"flex flex-col gap-5"}>
          <div className={"flex flex-row"}>

            <div className={"bg-primary py-1 px-2 rounded-md hover:bg-opacity-80 cursor-pointer"}>
              <IoRefreshOutline onClick={() => {
                setPage(1);
                orders
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
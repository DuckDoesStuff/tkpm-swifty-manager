"use client"

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import Loader from "@/components/common/Loader";
import {Modal} from "antd";
import {deleteObject, getStorage, listAll, ref} from "@firebase/storage";
import {auth} from "@/js/firebase.config";
import {IoRefreshOutline} from "react-icons/io5";
import Link from "next/link";

interface Product {
  id: number;
  displayName: string;
  sold: number;
  stock: number;
  price: number;
  createdAt: string;
}

interface ProductRowProps extends Product{
  shopNameId: string;
}

function ProductRow({id, displayName, sold, stock, price, createdAt, shopNameId}: ProductRowProps) {
  const [remove, setRemove] = useState(false);
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleString();

  const handleRemove = () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/product/${id}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete product");
        }
        const storage = getStorage();
        const userId = auth.currentUser?.uid;
        const productRef = ref(storage, `/public/${userId}/${shopNameId}/products/${id}`);
        listAll(productRef)
          .then((res) => {
            res.items.forEach((itemRef) => {
              deleteObject(itemRef).then(() => {
                console.log("Deleted successfully");
              }).catch((error) => {
                console.error("Error deleting", error);
              });
            });
            setRemove(false);
          })
          .catch((error) => {
            console.error("Error listing", error);
          });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const ModalFooter = () => {
    return (
      <div className={"flex flex-row-reverse gap-3"}>
        <button onClick={handleRemove} className={"bg-danger rounded-lg px-4 py-2 text-white font-bold hover:bg-opacity-80"}>Remove</button>
        <button onClick={() => setRemove(false)} className={"border border-primary rounded-lg px-4 py-2 text-primary font-bold hover:bg-opacity-80"}>Cancel</button>
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
        <p className={"text-black-2 text-lg"}>Are you sure you want to remove this product?</p>
        <p className={"text-black-2 text-lg"}>This action can't be undo</p>
      </Modal>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{displayName}</td>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{sold}</td>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{stock}</td>
      <td className={"whitespace-nowrap font-medium px-4 py-2 text-black dark:text-white"}>{price}</td>
      <td className={"whitespace-nowrap font-medium pl-4 py-2 text-black dark:text-white"}>{formattedDate}</td>
      <td
        className={"whitespace-nowrap font-medium px-1 py-2 text-black hover:text-meta-6 dark:text-white dark:hover:text-meta-6 cursor-pointer"}>
        <Link href={`./product/${id}`}>
          Detail
        </Link>
      </td>
      <td
        className={"whitespace-nowrap font-medium px-1 py-2 text-black hover:text-primary dark:text-white dark:hover:text-primary cursor-pointer"}>
        <Link href={`./product/${id}?edit=true`}>
          Edit
        </Link>
      </td>
      <td onClick={() => setRemove(true)}
          className={"whitespace-nowrap font-medium px-1 py-2 text-black hover:text-danger dark:text-white dark:hover:text-danger cursor-pointer"}>
        Delete
      </td>
    </tr>
  )

}

interface ProductTableProps {
  products: Product[];
  shopNameId: string;
}

function ProductTable({products, shopNameId}: ProductTableProps) {
  return (
    <div className={"border border-strokedark rounded-md dark:border-gray-3 overflow-x-auto"}>
      <table className={"w-full divide-y divide-strokedark dark:divide-gray-3 rounded-md"}>
        <thead className={"text-primary dark:text-meta-3 font-extrabold text-lg"}>
        <tr className={"text-left"}>
          <th className={"px-4 py-2"}>Product Name</th>
          <th className={"px-4 py-2"}>Sold</th>
          <th className={"px-4 py-2"}>Stock</th>
          <th className={"px-4 py-2"}>Price</th>
          <th className={"pl-4 py-2"}>Created At</th>
          <th className={"px-1 py-2"}></th>
          <th className={"px-1 py-2"}></th>
          <th className={"px-1 py-2"}></th>
        </tr>
        </thead>

        <tbody className={"divide-y divide-strokedark dark:divide-gray-3"}>
        {products.map((product, key) => (
          <ProductRow shopNameId={shopNameId} key={key} {...product}/>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ProductList() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;
  const [orderby, setOrderby] = useState("createdAt");

  useEffect(() => {
    fetchData();
  }, [params.id, page, orderby]);

  const fetchData = () => {
    setLoading(true);
    const data = fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/product?limit=${limit}&shop=${params.id}&offset=${(page - 1) * limit}&orderby=${orderby}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    data.then((data) => {
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setLoading(false);
    });
  }

  if (loading) {
    return (
      <div>
        <h1 className={"text-3xl text-black-2 dark:text-white font-bold mb-5"}>Product list</h1>
        <Loader/>
      </div>
    )
  }

  const optionsSort = [
    {label: "Created At", value: "createdAt"},
    {label: "Sold", value: "sold"},
    {label: "Stock", value: "stock"},
    {label: "Price", value: "price"}
  ]

  return (
    <div className={"rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark"}>
      <div className={"flex justify-between"}>
        <h1 className={"text-3xl text-black-2 dark:text-white font-bold mb-5"}>Product list</h1>
        <Link href={`${params.id}/new`}
              className={"flex-col items-center text-center bg-primary text-white rounded-md h-fit px-4 py-2 hover:bg-opacity-80 disabled:bg-bodydark1 disabled:text-black"}> New
          Product </Link>
      </div>


        <div className={"flex flex-col gap-5"}>
          <div className={"flex flex-row gap-10"}>

            <div className={"bg-primary py-1 px-2 rounded-md hover:bg-opacity-80 cursor-pointer"}>
              <IoRefreshOutline onClick={() => {
                setPage(1);
                fetchData()
              }} className={"text-white"} fontSize={25}/>
            </div>

            {/*<div className={"flex items-center justify-center gap-4"}>*/}
            {/*  <h1>Sort: </h1>*/}
            {/*  <Select*/}
            {/*    className={"w-40"}*/}
            {/*    defaultValue={orderby}*/}
            {/*    options={optionsSort}*/}
            {/*    onChange={(value) => {*/}
            {/*      setOrderby(value);*/}
            {/*    }}/>*/}
            {/*</div>*/}
          </div>
          {products.length === 0 ?
            <p className={"text-black-2 dark:text-white"}>It looks like you don't have any products</p> :
            <>
              <ProductTable shopNameId={params.id as string} products={products}/>
              <div className={"flex flex-row justify-between items-center"}>
                <button
                  disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className={"bg-primary text-white rounded-md px-4 py-2 disabled:bg-bodydark1 disabled:text-black"}>Previous page
            </button>

            <p className={"text-black-2 dark:text-white"}>Page {page} of {totalPages}</p>

            <button
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    className={"bg-primary text-white rounded-md px-4 py-2 disabled:bg-bodydark1 disabled:text-black"}>Next page
            </button>
          </div>
            </>}
        </div>

    </div>
  )
}
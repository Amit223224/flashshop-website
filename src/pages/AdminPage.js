import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout'
import  fireDB from '../FirebaseConfig'
import { collection, addDoc,getDocs,setDoc ,doc } from "firebase/firestore";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import {Modal ,Tabs ,Tab} from 'react-bootstrap'
import {  toast } from 'react-toastify'; 



const AdminPage = () => {
     
         const [products,setproducts]=useState([]);
         const[loading,setLoading]=useState(false);
         

          const[product, setProduct]=useState({
         
            Name :"",
           price:0,
           image:"",
           category:"",
    
          });
           const [add,setAdd]=useState(false);

          const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
         const [Orders,setorder]=useState([]);
         
         const  userid = JSON.parse(localStorage.getItem("currentuser")).user.uid ;

           useEffect(() => {
             getData();
         }, []);                    
        
       const getData = async()=> {
               
                try {
                   setLoading(true);
             const result = await getDocs(collection(fireDB, "products"))
                const AdminArray =[];
                 result.forEach((doc) => {
 
                  const obj ={
                       id:doc.id,
                       ...doc.data()
                           }
                AdminArray.push(obj);
                setLoading(false);
                       });
      setproducts(AdminArray);
      
         }
      catch(error){
          console.log(error);
          setLoading(false)
      } 

    };


     const edithandler = (item)=>{
     setProduct(item);
      handleShow();
      };

const UpdateProduct =async ()=>{
try {
    setLoading(true)
    await setDoc(doc(fireDB, "products", product.id), product)
    window.location.reload()
    setLoading(false)
    handleClose();
    
    toast.success('product update Successful')
    
} catch (error) {
    toast.error('product update Faild')
    setLoading(false)
}
};

               useEffect(() => {
             getData1();
         }, [])                    

             const getData1 = async()=> {
               setLoading(true);
                try {
                   
             const result = await getDocs(collection(fireDB, "orders"));
                const orderArray =[];
                 result.forEach((doc) => {
                orderArray.push(doc.data());
                setLoading(false);
                
                       });
                       
      setorder(orderArray);
         }
      catch(error){
          console.log(error);
          setLoading(false)
      } 

    };




const addHandler=()=>{
    setAdd(true);
    handleShow();
};


 const addProduct =async ()=>{
try {
    setLoading(true)
    await addDoc(collection(fireDB, "products"),product)
    setLoading(false)
    toast.success('product update Successful')
     handleClose();
     window.location.reload()
} catch (error) {
    toast.error('product update Faild')
    setLoading(false)
}
}


    return (
        <Layout loading={loading}>
        <Tabs defaultActiveKey="orders" id="uncontrolled-tab-example" className="mb-3">
  <Tab eventKey="products " title="Products">             
<div className="d-flex justify-content-end">
          <button className="btn" onClick={addHandler} >Add Product</button>  
        </div>
        <div>
          <table className="table mt-3">
             <thead>
                 <tr>
                     <th>Image</th>
                     <th>Name</th>
                     <th>Category</th>
                     <th>Price</th>
                     <th>Action</th>
                 </tr>
             </thead>
             <tbody>
                 { products.map((item)=>{
                 return  <tr>
                     <td><img src={item.image} alt="" height="80"  width="80"/></td>
                     <td>{item.title}</td>
                     <td>{item.category}</td>
                     <td>$ {item.price}</td>
                     <td><FaTrash color="red"/>
                      <FaEdit color="blue" onClick={()=> edithandler(item)}/></td>
                    
                 </tr>
                
                 })}
             </tbody>
         </table>
          <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{add===true?('add a Product'):('Edit a product')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         
        <div className="form-register p-5">
                <h2>Product Details</h2>
                   <hr/>

                <input type="text"
                 className="from-control"
                  placeholder="name"
                  name=""
                   value={product.title}
                    onChange ={(e)=>{setProduct({...product, title: e.target.value})}}/>
                     <br></br>

                 <input type="address"
                  className="from-control mt-4"
                
                   name=""
                    value={product.price}
                     onChange={(e)=>{setProduct({...product, price: e.target.value})}}/>
                     <br></br>
                 <input type="text"
                  className="from-control mt-4"
                   
                   name=""
                    value={product.image}
                     onChange={(e)=>{setProduct({...product, image:e.target.value})}}/>
                     <br></br>
                      <input type="text"
                  className="from-control mt-4"
                  name=""
                
                    value={product.category}
                     onChange={(e)=>{setProduct({...product, category:e.target.value})}}/>

                
              </div>
              
               </Modal.Body>
        <Modal.Footer>
          <button className="btn rounded-pill" onClick={handleClose}>
            Close
          </button>
         {add ?(<button className="btn" onClick={addProduct}> Save</button>)
         :( <button  className="btn " onClick={UpdateProduct}> Save</button>)}    
             </Modal.Footer>
      </Modal>
        </div>

  </Tab>
  <Tab eventKey="orders" title="Orders">
        { Orders.filter(obj=>obj.userid === userid).map(order => {
              return (
                   <table className="table mt-3">
             <thead className="border">
                 <tr >
                     <th>Image</th>
                     <th>Name</th>
                     <th>Price</th>
                     <th>Action</th>
                 </tr>
             </thead>
             <tbody>
                 {order.cartItems.map(item => {
                 return  <tr >
                     <td><img src={item.image} alt="" height="80"  width="80"/></td>
                     <td>{item.title}</td>
                     <td>$ {item.price}</td>
                     

                 </tr>
                 
                 })}
             </tbody>
         </table>
    
              )}
          )
          } 
  </Tab>
  <Tab eventKey="contact" title="Contact" disabled>
   <h1> Contact</h1>
  </Tab>
</Tabs>
  
          
        
        </Layout>
    )
}

export default AdminPage;

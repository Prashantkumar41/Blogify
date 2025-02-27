import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { 
  updateStart , 
  updateSuccess,
  updateFailure ,
  deleteUserStart,
  deleteUserSucccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';



import { useDispatch } from "react-redux";
// import { updateUser } from "../../../api/controllers/user.controller";
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import {Link} from 'react-router-dom';


export default function DashProfile() {

  const { currentUser  , error} = useSelector((state) => state.user);
  const [imageFile , setImageFile ] = useState(null);
  const [imageFileUrl , setImageFileUrl] = useState(null);
  const filePickerRef = useRef(); // for image picker
  const dispatch = useDispatch();

  // 5.00.00 
  const [formData , setFormData] = useState({});
  const [updateUserSuccess , setUpdateUserSuccess] = useState(null);
  const [updateUserError , setupdateUserError] = useState(null);

// deletionn 
  const [showModel , setShowModel] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  // console.log(imageFile , imageFileUrl);

  useEffect( () => {
    if(imageFile){
      uploadImage();
    }
  } , [imageFile]);

  const uploadImage = async () => {
    console.log('uploading image.....');
    
  }
  
  const handleChange = (e) =>{
    setFormData({...formData , [e.target.id] : e.target.value });
  }
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setupdateUserError(null);
    setUpdateUserSuccess(null);
    if(Object.keys(formData).length === 0){
      setupdateUserError('No changes made');
      return;
    }

    // // this small section for image uploading 
    // if(imageFileUploading){
    //   setupdateUserError('Please wait for image to upload');
    //   return ;
    // }


    try{
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    const data = await res.json();
    if(!res.ok){
      dispatch(updateFailure(data.message));
      setupdateUserError(data.message);
    }
    else{
      dispatch(updateSuccess(data));
      setUpdateUserSuccess("User's profile updated successfully");
    }
    }catch(error){
      dispatch(updateFailure(error.message)); 
      setupdateUserError(error.message);
    }
  }

  const handleDeleteUser = async() =>{
    setShowModel(false);
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE', 
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }
      else{
        dispatch(deleteUserSucccess(data));
      }
    }catch (error){
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async ()=>{
    try {
      const res = await fetch('/api/user/signout' , {
        method:'POST',
      });
      const data = await res.json();

      if(!res.ok){
        console.log(data.message);
        
      }else{
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div
          className=" relative w-32 h-32 self-center cursor-pointer 
          shadow-md overflow-hidden rounded-full" onClick={ ()=> filePickerRef.current.click()}
        >


        {/* {imageFileUploadProgress && (
          <CircularProgressbar value={imageFileUploadProgress || 0 } 
          text={`${imageFileUploadProgress}%`}
          strokeWidth={5}
          styles={{
            root:{
              width:'100%',
              height:'100%',
              position:'absolute',
              top:0,
              left:0,
            },
            path:{
              stroke:`rgba(62,152,199,${imageFileUploadProgress/100})`,
            },
          }}
          />
        )
      } */}

        
          

          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full object-cover border-8
            border-[lightgray]"
          />
        </div>

        {/* this is the error occr when upload image  : it shwo the error  */}
        {/* {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>} */}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <TextInput type="password" id="password" placeholder="password" onChange={ handleChange } />

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>

        {
          currentUser.isAdmin && (
          <Link to={'/create-post  '}>
            <Button 
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
              >
              Create a post
            </Button>
          </Link>
          )}


      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={()=> setShowModel(true)} className="cursor-pointer">Delete Account</span>
        <span onClick={handleSignout} className="cursor-pointer">Sign Out</span>
      </div>

      {
        updateUserSuccess && (
          <Alert color='success' className="mt-5">
            {updateUserSuccess}
          </Alert>
      )}
      { updateUserError && (
          <Alert color='failure' className="mt-5">
            {updateUserError}
          </Alert>
      )}
      { error && (
          <Alert color='failure' className="mt-5">
            {error}
          </Alert>
      )}

        <Modal 
            show={showModel}
            onClose={() => setShowModel(false)}
            popup
            size='md'
        >

          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400
              dark:text-gray-200 mb-4 mx-auto' />

              <h3 className='mb-5 text-lg text-gray-500
              dark:text-gray-400'>
                  Are you sure you want to delete your account?
              </h3>
              <div className="flex justify-center gap-6">
                <Button color='failure' onClick={handleDeleteUser}>
                    Yes, I'm sure
                </Button>
                <Button color="gray" onClick={()=> setShowModel(false)}>
                  No , Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>



    </div>
  );
}




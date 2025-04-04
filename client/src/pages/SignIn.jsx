// import { FlatESLint } from 'eslint/use-at-your-own-risk';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import { useDispatch ,useSelector} from 'react-redux';
import { signInStart,signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth';




export default function SignIn() {

  const [formData , setFormData] = useState({});
  // const [errorMessage , setErrorMessage] = useState(null);
  // const [loading , setLoading] = useState(false);

  const {loading , error:errorMessage} = useSelector((state) => state.user);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData , [e.target.id]:e.target.value.trim()});
  };


  console.log(formData);
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!formData.email || !formData.password){
      return dispatch(signInFailure('Please fill out all fields'));
    }

    try {
      // setLoading(true);
      // setErrorMessage(null); // iske bajye dispatch use ho rha hai 
      dispatch(signInStart());

      // app.get('/api/test', (req, res) => res.send('Proxy Working!'));

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        // credentials: 'include',
      });

      
      const data = await res.json();
      if(!data.success ){
      // if(data.success === false){
        dispatch(signInFailure(data.message));
      }
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      } 
    } catch(error) {
      // setErrorMessage(error.message);
      // setLoading(False);
      dispatch(signInFailure(error.message));
    }
  };


  return (
  <div className='min-h-screen mt-20'>
      <div className=" flex p-3 max-w-3xl mx-auto flex-col md:flex-row
      md:items-center gap-6 ">
        {/* left side  */}
        <div className="flex-1">
        <Link 
            to="/"
            className='font-bold dark:text-white text-3xl'>

            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 
            via-purple-500 to-pink-500 rounded-lg text-white'>Prashant</span>
            Blog
        </Link>
        <p className='text-sm mt-5'>
          This is a demo project.You can sign in with your email
          and password
          or with Google.
        </p>
        </div>

        {/* right side  */}
        <div className="flex-1">
              <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div>
                  <Label value='Your email' />
                  <TextInput type='email' placeholder='email' id='email'
                  onChange={handleChange}/>
                </div>
                <div>
                  <Label value='Your password' />
                  <TextInput type='password' placeholder='********' id='password'
                   onChange={handleChange}/>
                </div>

                <Button gradientDuoTone='pinkToOrange' type='submit' disabled={loading}>
                  {
                    loading ? (
                      <>
                      <Spinner size='sm' />
                      <span className='pl-3'>Loading...</span>
                      </>
                    ) : (
                      'Sign In'
                    )}
                </Button>

                <OAuth />
                
              </form>

              <div className='flex gap-2 text-sm mt-5'>
                <span>Dont Have an account?</span>
                <Link to='/sign-up' className='text-blue-500'>
                    Sign up
                </Link>
              </div>
              {
                errorMessage && (
                  <Alert className='mt-5' color='failure' >
                    {errorMessage}
                  </Alert>
                )
              }
        </div>
      </div>
  </div>
  );
}





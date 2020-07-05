import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      context.login(result.data.login);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className=''>
      {loading ? (
        <div className='ui active transition visible dimmer'>
          <div className='content'>
            <div className='ui loader'></div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className='container'>
        <h2 className='text-center'>Login</h2>
        <form
          onSubmit={onSubmit}
          noValidate
          className={
            loading ? 'loading form-width-register' : 'form-width-register'
          }
        >
          <label htmlFor='username-field'>Username*</label>
          <input
            class='form-control'
            id='username-field'
            type='text'
            name='username'
            value={values.username}
            placeholder='Username..'
            onChange={onChange}
            error={errors.username ? true : false}
          />
          <br />
          <label htmlFor='password-field'>Password*</label>
          <input
            class='form-control'
            id='password-field'
            type='password'
            name='password'
            value={values.password}
            placeholder='Password..'
            onChange={onChange}
            required
            error={errors.password ? true : false}
          />
          <br />
          <button type='submit' className='btn btn-outline-primary'>
            Login!
          </button>
        </form>
        {Object.keys(errors).length > 0 && (
          <div className='ui error message'>
            <ul className='list'>
              {Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username

      password: $password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;

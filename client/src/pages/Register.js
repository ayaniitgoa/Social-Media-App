import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className=''>
      {loading ? (
        <div class='ui active transition visible dimmer'>
          <div class='content'>
            <div class='ui loader'></div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className='container'>
        <h2 className='text-center'>Register</h2>
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
          <label htmlFor='email-field'>Email*</label>
          <input
            class='form-control'
            type='email'
            id='email-field'
            name='email'
            value={values.email}
            placeholder='Email..'
            onChange={onChange}
            required
            error={errors.email ? true : false}
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
          <label htmlFor='confirmPassword-field'>Confirm Password*</label>
          <input
            class='form-control'
            type='password'
            id='confirmPassword-field'
            name='confirmPassword'
            value={values.confirmPassword}
            placeholder='Confirm Password..'
            onChange={onChange}
            required
            error={errors.confirmPassword ? true : false}
          />
          <br />
          <button type='submit' className='btn btn-outline-primary'>
            Register!
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;

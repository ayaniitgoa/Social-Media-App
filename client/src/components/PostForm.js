import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { FETCH_POSTS_QUERY } from '../utils/graphql';
import { useForm } from '../utils/hooks';

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = '';
    },
    onError(err) {
      //console.log(err)
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <div>
      <h3>Post!</h3>
      <form className='post-body' onSubmit={onSubmit}>
        <textarea
          className='form-control'
          placeholder='Create a post..😃'
          name='body'
          onChange={onChange}
          value={values.body}
        />
        <button type='submit' className='btn btn-outline-info mb-4 mt-2'>
          Post!
        </button>
      </form>
      {error && (
        <div className='ui error message post-body-form-error'>
          <ul className='list'>{error.graphQLErrors[0].message}</ul>
        </div>
      )}
    </div>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;

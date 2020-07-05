import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Confirm } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../utils/graphql';

function DeleteButton({ postId, user, username, callback, commentId }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  function deleteButton() {
    if (user) {
      if (user.username === username) {
        return (
          <div className=''>
            <button
              onClick={() => setConfirmOpen(true)}
              className='btn btn-danger float-right trash-button'
              data-toggle='modal'
              data-target='#exampleModal'
            >
              <i className='fas fa-trash'></i>
            </button>
          </div>
        );
      }
    }
  }

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((p) => p.id !== postId),
          },
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <div className=''>
      {deleteButton()}
      <div className='modal-delete'>
        <Confirm
          className='modal-delete'
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={deletePostOrMutation}
        />
      </div>
    </div>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;

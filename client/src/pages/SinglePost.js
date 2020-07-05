import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';
import LikeButton from '../components/LikeButton';
import { useState } from 'react';

function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;

  const [comment, setComment] = useState('');

  const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
    onError(err) {},
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    props.history.push('/');
  }

  if (loading) {
    return (
      <div className='ui active transition visible dimmer'>
        <div className='content'>
          <div className='ui loader'></div>
        </div>
      </div>
    );
  }
  if (error) {
    return <p>Error..</p>;
  }
  let postMarkup;
  if (!data.getPost) {
    postMarkup = <p>Loading..</p>;
  } else {
    const {
      id,
      body,
      comments,
      likes,
      username,
      createdAt,
      likeCount,
      commentCount,
    } = data.getPost;
    postMarkup = (
      <div className=''>
        <div className='card single-card'>
          <h4 className='card-header text-success'>{username}</h4>
          <div className='card-body '>
            <h6 className='card-subtitle mb-2 text-muted'>
              {moment(createdAt).fromNow(true)}
            </h6>
            <div className='card-body '>
              <h5 className='card-text text-success'>{body}</h5>
            </div>
          </div>
          <div className='card-footer bg-transparent d-flex'>
            <LikeButton user={user} post={{ id, likes, likeCount }} />
            <Link to={`/posts/${id}`}>
              <button className='btn btn-outline-primary'>
                <i className='fas fa-comments'></i> {commentCount}
              </button>
            </Link>
            <div className='single-post-delete'>
              {user && user.username === username && (
                <DeleteButton
                  postId={id}
                  user={user}
                  username={username}
                  callback={deletePostCallback}
                />
              )}
            </div>
          </div>
        </div>

        <div className=''>
          <h3 className='mt-5'>Post a comment!</h3>
          {user && (
            <form>
              <textarea
                type='text'
                className='form-control comment-textarea'
                placeholder='Comment..😃'
                name='comment'
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <button
                className='btn btn-success mt-2'
                type='submit'
                disabled={comment.trim() === ''}
                onClick={submitComment}
              >
                Comment!
              </button>
            </form>
          )}
        </div>
        <div className='card-header mt-3'>
          <h4> Comments ({commentCount})</h4>
        </div>
        {comments.map((comment) => (
          <div className='card mb-3 ' key={comment.id}>
            {user && user.username === comment.username && (
              <div className='deleteButton-comment'>
                <DeleteButton
                  postId={id}
                  commentId={comment.id}
                  user={user}
                  username={username}
                />
              </div>
            )}
            <div className='card-body'>
              <h4 className='card-title'>{comment.username}</h4>
              <h6 className='card-subtitle mb-3 text-muted'>
                {moment(comment.createdAt).fromNow(true)}
              </h6>
              <h5 className='card-text'>{comment.body}</h5>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }

      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

function LikeButton({ user, post: { id, likes, likeCount } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError(err) {
      // console.log(err);
    },
  });

  function likeButton() {
    if (user) {
      if (liked) {
        return (
          <button
            className='btn btn-outline-danger'
            style={{ marginRight: 10 }}
            onClick={likePost}
          >
            <i className='fas fa-heart'></i> {likeCount}
          </button>
        );
      } else {
        return (
          <button
            className='btn btn-outline-danger'
            style={{ marginRight: 10 }}
            onClick={likePost}
          >
            <i className='far fa-heart'></i> {likeCount}
          </button>
        );
      }
    } else {
      return (
        <Link to='/login'>
          <button
            className='btn btn-outline-danger'
            style={{ marginRight: 10 }}
            onClick={likePost}
          >
            <i className='far fa-heart'></i> {likeCount}
          </button>
        </Link>
      );
    }
  }

  // const likeButton = user ? (
  //   liked ? (
  //     <i className='fas fa-heart'></i>
  //   ) : (
  //     <i className='far fa-heart'></i>
  //   )
  // ) : (
  //   <Link to='/login'>
  //     <i className='far fa-heart'></i>
  //   </Link>
  // );

  return <div className=''>{likeButton()}</div>;
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;

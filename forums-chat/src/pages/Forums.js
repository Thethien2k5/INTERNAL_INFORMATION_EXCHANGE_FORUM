import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import '../components/css/Forums.css';


function Forums() {
  const [showModal, setShowModal] = useState(false);
  const [showReactionBox, setShowReactionBox] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reactionCount, setReactionCount] = useState(0);


  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const toggleReactionBox = () => {
    setShowReactionBox(!showReactionBox);


  
  };

  const handleReaction = (reaction) => {
    if (selectedReaction === reaction) {
      // Hủy chọn nếu trùng
      setSelectedReaction(null);
      setReactionCount(reactionCount > 0 ? reactionCount - 1 : 0);
    } else if (selectedReaction === null) {
      // Lần đầu chọn
      setSelectedReaction(reaction);
      setReactionCount(reactionCount + 1);
    } else {
      // Đổi cảm xúc
      setSelectedReaction(reaction);
    }
    setShowReactionBox(false);
  };
  

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="forums-content">
        {/* Banner */}
        <div className="background-banner">
          <img src={process.env.PUBLIC_URL + '../img/banner.webp'} alt="Banner" />
          <h1>Diễn đàn T3V – Nơi trao đổi kiến thức chuyên sâu</h1>
          <p>
            Cùng thảo luận, chia sẻ kinh nghiệm, kiến thức và giải đáp nhiều vấn đề trong cuộc sống.
            Mọi kiến thức, mọi lĩnh vực !!!
          </p>
        </div>

        {/* Thanh nhập câu hỏi */}
        {/* <div className="ask-box" onClick={openModal}>
          <input type="text" placeholder="Bạn muốn đặt câu hỏi..." readOnly />
          <button type="button">
            <i className="fa-regular fa-message"></i> Câu hỏi mới
          </button>
        </div> */}


        {/* Bài viết mẫu */}
        

        <div className="post">
          <div className="post-header">
            <img className="avatar" src={process.env.PUBLIC_URL + "../forums-chat/public/img/laugh.jpg"} alt="Avatar" />
            <div className="user-info">
              <strong>Anime</strong>
              <span>Người chủ trì: Nobita</span>
            </div>
          </div>
          <div className="post-content">
            <p><strong>Mô tả</strong></p>
            <p>Cùng nhau trao đổi về các bộ anime hot nhất, chia sẽ các kiến thức về anime, v.vv</p>
            {/* <div className="hashtags">
              <span>#wibu</span> <span>#anime</span>
            </div> */}
          </div>

          

          <div className="post-reactions">
            <div className="reaction-button" onClick={toggleReactionBox}>
              {selectedReaction ? (
                <>
                  {selectedReaction} <span>{reactionCount}</span>
                </>
              ) : (
                <i className="fa-regular fa-heart"></i>
              )}

            </div>

            {/* Nút bình luận
              <div className="comment-button">
                <i className="fa-regular fa-comment"></i> 
              </div> */}
              
              {/* Nút chia sẻ */}
              <div className="share-button">
                <i className="fa-solid fa-share"></i>
              </div>

            {showReactionBox && (
              <div className="reaction-box">
                <span onClick={() => handleReaction("👍")}>👍</span>
                <span onClick={() => handleReaction("❤️")}>❤️</span>
                <span onClick={() => handleReaction("😢")}>😢</span>
                <span onClick={() => handleReaction("😂")}>😂</span>
                <span onClick={() => handleReaction("😡")}>😡</span>
              </div>
            )}
          </div>
          
        </div>

        <div className="post">
          <div className="post-header">
            <img className="avatar" src={process.env.PUBLIC_URL + "/forums-chat/public/img/laugh.jpg"} alt="Avatar" />
            <div className="user-info">
              <strong>Hỏi dân IT</strong>
              <span>Người chủ trì: Thọ Chềnh</span>
            </div>
          </div>
          <div className="post-content">
            <p><strong>Mô tả</strong></p>
            <p>Trao đổi các kiến thức về lập trình</p>
            {/* <div className="hashtags">
              <span>#ielts</span> <span>#general-english</span>
            </div> */}
          </div>

          

          <div className="post-reactions">
            <div className="reaction-button" onClick={toggleReactionBox}>
              {selectedReaction ? (
                <>
                  {selectedReaction} <span>{reactionCount}</span>
                </>
              ) : (
                <i className="fa-regular fa-heart"></i>
              )}

            </div>

            {/* Nút bình luận */}
              {/* <div className="comment-button">
                <i className="fa-regular fa-comment"></i> 
              </div>
               */}
              {/* Nút chia sẻ */}
              <div className="share-button">
                <i className="fa-solid fa-share"></i>
              </div>

            {showReactionBox && (
              <div className="reaction-box">
                <span onClick={() => handleReaction("👍")}>👍</span>
                <span onClick={() => handleReaction("❤️")}>❤️</span>
                <span onClick={() => handleReaction("😢")}>😢</span>
                <span onClick={() => handleReaction("😂")}>😂</span>
                <span onClick={() => handleReaction("😡")}>😡</span>
              </div>
            )}
          </div>
        </div>

         

        {/* Popup Bài viết mới */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <span className="title">Bài viết mới</span>
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
              </div>
              <div className="modal-body">
                <select>
                  <option selected disabled>Chọn chuyên mục</option>
                  <option>Học tập</option>
                  <option>Kỹ năng</option>
                </select>
                <input type="text" placeholder="Tiêu đề" />
                <textarea placeholder="Nhập nội dung bài viết..."></textarea>
                <div className="modal-footer">
                  <button className="submit">Đăng bài</button>
                </div>
              </div>
            </div>
          </div>

          
          
        )}
      </div>
    </div>
    
  );
}

export default Forums;
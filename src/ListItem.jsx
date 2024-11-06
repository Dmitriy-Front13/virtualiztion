import React from 'react';

const ListItem = React.memo(
  React.forwardRef(({ user }, ref) => {
    return (
      <div
        className="user-card"
        style={userCardStyle}
        ref={ref} // Привязываем ref к элементу
      >
        <img src={user.picture.medium} alt={user.name.first} style={imageStyle} />
        <div>
          <h3>{`${user.name.first} ${user.name.last}`}</h3>
          <p>{user.email}</p>
        </div>
      </div>
    );
  })
);

// CSS стили
const userCardStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '8px',
};

const imageStyle = {
  borderRadius: '50%',
  marginRight: '20px',
};

export default ListItem;

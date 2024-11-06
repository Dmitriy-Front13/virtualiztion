import { useState, useEffect } from 'react';

const App = () => {
  const [users, setUsers] = useState([]); // Массив пользователей
  const [page, setPage] = useState(1); // Текущая страница
  const [isLoading, setIsLoading] = useState(false); // Индикатор загрузки

  // Функция для загрузки пользователей с API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://randomuser.me/api/?results=10&page=${page}`);
      const data = await response.json();
      console.log(data);
      
      setUsers((prevUsers) => [...prevUsers, ...data.results]); // Добавляем новых пользователей в массив
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setIsLoading(false);
    }
  };

  // Эффект для загрузки данных при изменении страницы
  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Обработчик прокрутки страницы
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 200
    ) {
      setPage((prevPage) => prevPage + 1); // Увеличиваем страницу, чтобы загрузить новых пользователей
    }
  };

  // Добавляем обработчик прокрутки при монтировании компонента
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Бесконечная прокрутка - Пользователи</h1>
      <div className="user-list">
        {users.map((user, index) => (
          <div key={index} className="user-card" style={userCardStyle}>
            <img src={user.picture.medium} alt={user.name.first} style={imageStyle} />
            <div>
              <h3>{`${user.name.first} ${user.name.last}`}</h3>
              <p>{user.email}</p>
            </div>
          </div>
        ))}
      </div>
      {isLoading && <p>Загрузка...</p>}
    </div>
  );
};

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

export default App;
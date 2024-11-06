import { useState, useEffect, useRef } from 'react';

const App = () => {
  const [users, setUsers] = useState([]); // Массив пользователей
  const [isLoading, setIsLoading] = useState(false); // Индикатор загрузки
  const triggerRef = useRef(null);
  const observer = useRef(null);

  // Функция для загрузки пользователей с API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://randomuser.me/api/?results=10&page=1`);
      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, ...data.results]); // Добавляем новых пользователей в массив
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchUsers();
        }
      },
      { threshold: 1.0 } // Настраиваем, чтобы срабатывать, когда элемент полностью видим
    );
  }, []);
  
  useEffect(() => {
    if (triggerRef.current) {
      observer.current.observe(triggerRef.current); // Начинаем отслеживать последний элемент
    }

    // Отключение наблюдателя при размонтировании
    return () => {
      if (triggerRef.current) {
        observer.current.unobserve(triggerRef.current);
      }
    };
  }, [users]); // Запускаем эффект каждый раз, когда меняется список пользователей

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Бесконечная прокрутка - Пользователи</h1>
      <div className="user-list">
        {users.map((user, index) => (
          <div
            key={index}
            className="user-card"
            style={userCardStyle}
            ref={index === users.length - 1 ? triggerRef : null} // Привязываем ref к последнему элементу
          >
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

export const packagesData = [
  { id: 1, name: 'Package A', status: 'In Transit', courier: 'John Doe' },
  { id: 2, name: 'Package B', status: 'Delivered', courier: 'Jane Smith' },
  { id: 3, name: 'Package C', status: 'Pending', courier: 'John Doe' },
  { id: 4, name: 'Package D', status: 'In Transit', courier: 'Peter Jones' },
];

export const couriersData = [
  { id: 1, name: 'John Doe', deliveries: 25, rating: 4.5, position: [51.505, -0.09] },
  { id: 2, name: 'Jane Smith', deliveries: 30, rating: 4.8, position: [51.51, -0.1] },
  { id: 3, name: 'Peter Jones', deliveries: 20, rating: 4.2, position: [51.515, -0.09] },
];

export const deliveryTrendsData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Deliveries',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

export const packagesByCourierData = {
  labels: ['John Doe', 'Jane Smith', 'Peter Jones'],
  datasets: [
    {
      label: '# of Packages',
      data: [2, 1, 1],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// Mock data for testing infinite scroll
export const generateMockPets = (page = 1, limit = 9) => {
  const pets = [];
  const startId = (page - 1) * limit + 1;
  
  for (let i = 0; i < limit; i++) {
    const id = startId + i;
    pets.push({
      _id: `pet-${id}`,
      name: `Pet ${id}`,
      category: ['cat', 'dog', 'rabbit', 'bird'][id % 4],
      age: Math.floor(Math.random() * 10) + 1,
      location: `City ${id}`,
      shortDescription: `This is a lovely pet number ${id} looking for a forever home.`,
      image: `https://picsum.photos/400/300?random=${id}`,
    });
  }
  
  return {
    data: pets,
    currentPage: page,
    totalPages: 5, // Mock 5 pages total
    nextPage: page < 5 ? page + 1 : null,
    hasMore: page < 5
  };
};

export const generateMockCampaigns = (page = 1, limit = 9) => {
  const campaigns = [];
  const startId = (page - 1) * limit + 1;
  
  for (let i = 0; i < limit; i++) {
    const id = startId + i;
    campaigns.push({
      _id: `campaign-${id}`,
      petName: `Pet ${id}`,
      shortDescription: `Help Pet ${id} get the medical care they need.`,
      currentAmount: Math.floor(Math.random() * 1000),
      maxAmount: 2000,
      lastDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      petImage: `https://picsum.photos/400/300?random=${id + 100}`,
      isPaused: false,
      donations: Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => ({ id: i }))
    });
  }
  
  return {
    data: campaigns,
    currentPage: page,
    totalPages: 4, // Mock 4 pages total
    nextPage: page < 4 ? page + 1 : null,
    hasMore: page < 4
  };
};
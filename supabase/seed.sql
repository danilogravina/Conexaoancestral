-- ==========================================
-- SEED DATA - CONEXÃO ANCESTRAL
-- ==========================================

-- 1. Inserir Categorias
insert into categories (name, slug) values
('Educação', 'educacao'),
('Saúde', 'saude'),
('Sustentabilidade', 'sustentabilidade'),
('Cultura', 'cultura')
on conflict (name) do nothing;

-- 2. Inserir Projetos Iniciais
insert into projects (title, category, description, full_description, image_url, goal_amount, raised_amount, status, beneficiaries_count, year, impact_data, gallery) values
(
  'Sistema Sustentável de Captação e Distribuição de Água na T.I. Campinas/Katukina', 
  'Educação', 
  'Implementação de solução sustentável de captação e distribuição de água para assegurar água de qualidade no território Katukina.',
  'Este projeto nasce do movimento de fortalecimento cultural e territorial do povo Katukina, cujo nome significa “povo verdadeiro”. Ao longo dos anos, as aldeias localizadas às margens da BR-364, que atravessa a Terra Indígena Campinas/Katukina, passaram a enfrentar pressões crescentes sobre seus territórios, seus recursos naturais e seu modo de vida tradicional, gerando impactos ambientais, riscos à saúde e desafios à preservação cultural. Diante desse cenário, cerca de 12 famílias Katukina decidiram criar uma nova aldeia em uma área mais preservada do território, distante da rodovia, reafirmando seu compromisso com a floresta, com os saberes ancestrais e com uma vida em harmonia com a natureza. Esse deslocamento representa um gesto de resistência cultural, autonomia e fortalecimento da identidade indígena. Para que a nova aldeia possa se consolidar de forma digna e sustentável, o projeto prevê a implantação de um sistema de abastecimento de água potável, por meio da perfuração de um poço artesiano e da instalação de um sistema de bombeamento movido a energia solar fotovoltaica. A proposta busca reduzir a dependência de rios e igarapés, diminuir riscos de contaminação e garantir melhores condições de saúde e bem-estar para a comunidade. Mais do que uma solução de infraestrutura, o projeto representa um investimento no futuro do povo Katukina, fortalecendo a autonomia comunitária e contribuindo para a preservação cultural e ambiental da Terra Indígena Campinas/Katukina.',
  '/assets/img/project-details-gallery-1.jpg',
  60000, 
  45000, 
  'Em Andamento',
  120,
  2024,
  '{"objectives": ["Construção de 4 novas salas de aula bioclimáticas.", "Fornecimento de material didático bilíngue.", "Alimentação diária nutritiva."]}',
  '{"/assets/img/project-details-gallery-1.jpg", "/assets/img/project-details-gallery-2.jpg", "/assets/img/project-details-gallery-3.jpg", "/assets/img/project-details-gallery-4.jpg", "/assets/img/project-details-gallery-5.jpg", "/assets/img/project-details-gallery-6.jpg", "/assets/img/project-details-gallery-7.jpg"}'
),
(
  'Agrofloresta Comunitária', 
  'Sustentabilidade', 
  'Implementação de sistemas agroflorestais produtivos que recuperam o solo e geram renda para 50 famílias locais.',
  'O projeto de Agrofloresta Comunitária foca na regeneração de áreas degradadas e na criação de sistemas produtivos biodiversos.',
  '/assets/img/project-agrofloresta.jpg',
  30000, 
  12500, 
  'Em Andamento',
  50,
  2024,
  '{"objectives": ["Plantio de 5.000 mudas.", "Capacitação de 50 famílias.", "Criação de uma cooperativa."]}',
  '{"/assets/img/project-agrofloresta.jpg", "/assets/img/project-details-gallery-2.jpg", "/assets/img/project-details-gallery-5.jpg", "/assets/img/project-details-gallery-3.jpg"}'
),
(
  'Água Limpa para Todos', 
  'Saúde', 
  'Instalação de poços artesianos e sistemas de filtragem para garantir acesso à água potável em áreas remotas.',
  'O acesso à água potável é um direito fundamental. Este projeto instala sistemas de captação e purificação de água.',
  '/assets/img/project-agua-limpa.jpg',
  80000, 
  78000, 
  'Quase Lá',
  200,
  2024,
  '{"objectives": ["Instalação de 5 poços.", "Distribuição de filtros.", "Treinamento comunitário."]}',
  '{"/assets/img/project-agua-limpa.jpg", "/assets/img/project-details-gallery-4.jpg", "/assets/img/project-details-gallery-6.jpg", "/assets/img/project-details-gallery-7.jpg"}'
);

-- 3. Inserir Estatísticas Iniciais
insert into impact_stats (label, value, icon, suffix) values
('Famílias Apoiadas', 500, 'groups', '+'),
('Aldeias Impactadas', 32, 'location_on', ''),
('Projetos Concluídos', 15, 'task_alt', '')
on conflict (label) do update set value = excluded.value;

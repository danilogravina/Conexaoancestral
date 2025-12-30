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
  'Escola Viva da Floresta', 
  'Educação', 
  'Construção de espaços de aprendizado que integram o currículo tradicional com os saberes ancestrais para 120 crianças.',
  'A Escola Viva da Floresta é uma iniciativa vital para preservar a cultura indígena enquanto fornece educação formal de qualidade. Localizada no coração da Amazônia, a escola atende três comunidades ribeirinhas.',
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
  '{"/assets/img/project-agrofloresta.jpg", "/assets/img/project-details-gallery-2.jpg"}'
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
  '{"/assets/img/project-agua-limpa.jpg", "/assets/img/project-details-gallery-4.jpg"}'
);

-- 3. Inserir Estatísticas Iniciais
insert into impact_stats (label, value, icon, suffix) values
('Famílias Apoiadas', 500, 'groups', '+'),
('Aldeias Impactadas', 32, 'location_on', ''),
('Projetos Concluídos', 15, 'task_alt', '')
on conflict (label) do update set value = excluded.value;

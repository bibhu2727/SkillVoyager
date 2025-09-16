// Quiz Game Data Structure for SkillVoyager
// Contains questions across different career fields with multiple difficulty levels

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SkillCategory = 
  | 'Data Science'
  | 'Marketing'
  | 'Finance'
  | 'Software Development'
  | 'Project Management'
  | 'Design'
  | 'Sales'
  | 'Human Resources';

export interface QuizQuestion {
  id: string;
  category: SkillCategory;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer
  explanation: string;
  points: number;
}

export interface QuizSession {
  id: string;
  userId: string;
  category: SkillCategory;
  difficulty: DifficultyLevel;
  questions: QuizQuestion[];
  answers: (number | null)[];
  score: number;
  totalPoints: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}

export interface UserQuizStats {
  userId: string;
  totalQuizzes: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  categoryStats: Record<SkillCategory, {
    quizzesTaken: number;
    averageScore: number;
    bestScore: number;
  }>;
  achievements: string[];
  currentStreak: number;
  longestStreak: number;
  lastQuizDate: Date;
}

// Quiz Questions Database
export const quizQuestions: QuizQuestion[] = [
  // Data Science Questions - Beginner Level (15 questions)
  {
    id: 'ds_beg_001',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'Sequential Query Language'],
    correctAnswer: 0,
    explanation: 'SQL stands for Structured Query Language, used for managing and querying relational databases.',
    points: 10
  },
  {
    id: 'ds_beg_002',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'Which Python library is most commonly used for data manipulation?',
    options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
    correctAnswer: 1,
    explanation: 'Pandas is the most popular Python library for data manipulation and analysis.',
    points: 10
  },
  {
    id: 'ds_beg_003',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'What is a CSV file?',
    options: ['Comma Separated Values', 'Computer System Values', 'Central Storage Values', 'Code Structure Values'],
    correctAnswer: 0,
    explanation: 'CSV stands for Comma Separated Values, a simple file format used to store tabular data.',
    points: 10
  },
  {
    id: 'ds_beg_004',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'Which of these is NOT a data type in Python?',
    options: ['Integer', 'String', 'Boolean', 'Decimal'],
    correctAnswer: 3,
    explanation: 'Decimal is not a basic data type in Python. The basic types are int, str, bool, float, etc.',
    points: 10
  },
  {
    id: 'ds_beg_005',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'What does API stand for?',
    options: ['Application Programming Interface', 'Advanced Programming Integration', 'Automated Program Interaction', 'Application Process Integration'],
    correctAnswer: 0,
    explanation: 'API stands for Application Programming Interface, allowing different software applications to communicate.',
    points: 10
  },
  {
    id: 'ds_beg_006',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'Which chart type is best for showing trends over time?',
    options: ['Pie Chart', 'Bar Chart', 'Line Chart', 'Scatter Plot'],
    correctAnswer: 2,
    explanation: 'Line charts are ideal for displaying trends and changes over time periods.',
    points: 10
  },
  {
    id: 'ds_beg_007',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'What is the mean of the numbers: 2, 4, 6, 8, 10?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 1,
    explanation: 'The mean is calculated by adding all numbers (30) and dividing by the count (5), which equals 6.',
    points: 10
  },
  {
    id: 'ds_beg_008',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'Which Python library is used for creating visualizations?',
    options: ['Pandas', 'NumPy', 'Matplotlib', 'Requests'],
    correctAnswer: 2,
    explanation: 'Matplotlib is the primary Python library for creating static, animated, and interactive visualizations.',
    points: 10
  },
  {
    id: 'ds_beg_009',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'What is a database?',
    options: ['A collection of programs', 'A structured collection of data', 'A type of computer', 'A programming language'],
    correctAnswer: 1,
    explanation: 'A database is a structured collection of data that can be easily accessed, managed, and updated.',
    points: 10
  },
  {
    id: 'ds_beg_010',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'Which of these is a measure of central tendency?',
    options: ['Range', 'Standard deviation', 'Median', 'Variance'],
    correctAnswer: 2,
    explanation: 'Median is a measure of central tendency, along with mean and mode.',
    points: 10
  },
  {
    id: 'ds_beg_011',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'What does JSON stand for?',
    options: ['JavaScript Object Notation', 'Java Standard Object Notation', 'JavaScript Organized Network', 'Java Script Object Network'],
    correctAnswer: 0,
    explanation: 'JSON stands for JavaScript Object Notation, a lightweight data interchange format.',
    points: 10
  },
  {
    id: 'ds_beg_012',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'Which is the correct way to import pandas in Python?',
    options: ['import pandas', 'import pandas as pd', 'from pandas import *', 'All of the above'],
    correctAnswer: 3,
    explanation: 'All three methods are valid ways to import pandas, though "import pandas as pd" is the most common convention.',
    points: 10
  },
  {
    id: 'ds_beg_013',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'What is the purpose of data cleaning?',
    options: ['To make data look pretty', 'To remove or correct inaccurate data', 'To increase data size', 'To encrypt data'],
    correctAnswer: 1,
    explanation: 'Data cleaning involves identifying and correcting or removing inaccurate, incomplete, or irrelevant data.',
    points: 10
  },
  {
    id: 'ds_beg_014',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'Which file format is commonly used for storing large datasets?',
    options: ['TXT', 'CSV', 'PDF', 'DOC'],
    correctAnswer: 1,
    explanation: 'CSV (Comma Separated Values) is widely used for storing and exchanging tabular data.',
    points: 10
  },
  {
    id: 'ds_beg_015',
    category: 'Data Science',
    difficulty: 'Beginner',
    question: 'What is the first step in any data science project?',
    options: ['Building models', 'Data collection', 'Data visualization', 'Problem definition'],
    correctAnswer: 3,
    explanation: 'Problem definition is the crucial first step - understanding what problem you are trying to solve.',
    points: 10
  },

  // Data Science Questions - Intermediate Level (15 questions)
  {
    id: 'ds_int_001',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'What is the purpose of cross-validation in machine learning?',
    options: ['To increase model complexity', 'To evaluate model performance and prevent overfitting', 'To reduce training time', 'To increase dataset size'],
    correctAnswer: 1,
    explanation: 'Cross-validation helps evaluate model performance on unseen data and prevents overfitting by testing on multiple data splits.',
    points: 20
  },
  {
    id: 'ds_int_002',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'Which algorithm is best for linear regression?',
    options: ['K-means', 'Decision Tree', 'Linear Regression', 'Random Forest'],
    correctAnswer: 2,
    explanation: 'Linear Regression is specifically designed for modeling linear relationships between variables.',
    points: 20
  },
  {
    id: 'ds_int_003',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'What is feature engineering?',
    options: ['Creating new features from existing data', 'Removing features', 'Scaling features', 'Encoding features'],
    correctAnswer: 0,
    explanation: 'Feature engineering involves creating new features from existing data to improve model performance.',
    points: 20
  },
  {
    id: 'ds_int_004',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'Which metric is best for evaluating classification models with imbalanced datasets?',
    options: ['Accuracy', 'Precision', 'F1-Score', 'Recall'],
    correctAnswer: 2,
    explanation: 'F1-Score balances precision and recall, making it ideal for imbalanced datasets.',
    points: 20
  },
  {
    id: 'ds_int_005',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'What is the difference between supervised and unsupervised learning?',
    options: ['Supervised uses labeled data, unsupervised does not', 'Supervised is faster', 'Unsupervised is more accurate', 'No difference'],
    correctAnswer: 0,
    explanation: 'Supervised learning uses labeled training data, while unsupervised learning finds patterns in unlabeled data.',
    points: 20
  },
  {
    id: 'ds_int_006',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'Which technique is used to reduce dimensionality?',
    options: ['PCA', 'Linear Regression', 'K-means', 'Decision Tree'],
    correctAnswer: 0,
    explanation: 'PCA (Principal Component Analysis) is a popular technique for dimensionality reduction.',
    points: 20
  },
  {
    id: 'ds_int_007',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'What is overfitting in machine learning?',
    options: ['Model performs well on training but poorly on test data', 'Model is too simple', 'Model trains too fast', 'Model uses too few features'],
    correctAnswer: 0,
    explanation: 'Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize.',
    points: 20
  },
  {
    id: 'ds_int_008',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'Which sampling technique ensures each subgroup is represented?',
    options: ['Simple random sampling', 'Stratified sampling', 'Cluster sampling', 'Systematic sampling'],
    correctAnswer: 1,
    explanation: 'Stratified sampling divides the population into subgroups and samples from each to ensure representation.',
    points: 20
  },
  {
    id: 'ds_int_009',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'What is the purpose of regularization?',
    options: ['Increase model complexity', 'Prevent overfitting', 'Speed up training', 'Increase accuracy'],
    correctAnswer: 1,
    explanation: 'Regularization techniques like L1 and L2 help prevent overfitting by penalizing complex models.',
    points: 20
  },
  {
    id: 'ds_int_010',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'Which algorithm is best for clustering?',
    options: ['Linear Regression', 'K-means', 'Logistic Regression', 'Decision Tree'],
    correctAnswer: 1,
    explanation: 'K-means is one of the most popular clustering algorithms for grouping similar data points.',
    points: 20
  },
  {
    id: 'ds_int_011',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'What is the bias-variance tradeoff?',
    options: ['Balance between model simplicity and complexity', 'Balance between speed and accuracy', 'Balance between training and testing', 'Balance between features and samples'],
    correctAnswer: 0,
    explanation: 'The bias-variance tradeoff involves balancing model simplicity (high bias) with complexity (high variance).',
    points: 20
  },
  {
    id: 'ds_int_012',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'Which technique is used for handling missing data?',
    options: ['Imputation', 'Normalization', 'Standardization', 'Encoding'],
    correctAnswer: 0,
    explanation: 'Imputation involves filling in missing values using various strategies like mean, median, or mode.',
    points: 20
  },
  {
    id: 'ds_int_013',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'What is ensemble learning?',
    options: ['Using single model', 'Combining multiple models', 'Using deep learning', 'Using neural networks'],
    correctAnswer: 1,
    explanation: 'Ensemble learning combines multiple models to create a stronger predictor than individual models.',
    points: 20
  },
  {
    id: 'ds_int_014',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'Which metric measures the spread of data?',
    options: ['Mean', 'Median', 'Standard deviation', 'Mode'],
    correctAnswer: 2,
    explanation: 'Standard deviation measures how spread out data points are from the mean.',
    points: 20
  },
  {
    id: 'ds_int_015',
    category: 'Data Science',
    difficulty: 'Intermediate',
    question: 'What is the purpose of train-test split?',
    options: ['Reduce data size', 'Evaluate model performance', 'Speed up training', 'Clean data'],
    correctAnswer: 1,
    explanation: 'Train-test split separates data to train the model and evaluate its performance on unseen data.',
    points: 20
  },

  // Data Science Questions - Advanced Level (15 questions)
  {
    id: 'ds_adv_001',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'Which technique is best for handling class imbalance in classification problems?',
    options: ['Increasing learning rate', 'SMOTE (Synthetic Minority Oversampling)', 'Reducing features', 'Using more epochs'],
    correctAnswer: 1,
    explanation: 'SMOTE generates synthetic examples of minority classes to balance the dataset and improve model performance.',
    points: 30
  },
  {
    id: 'ds_adv_002',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'What is the vanishing gradient problem in deep learning?',
    options: ['Gradients become too large', 'Gradients become too small', 'Gradients become negative', 'Gradients become positive'],
    correctAnswer: 1,
    explanation: 'The vanishing gradient problem occurs when gradients become too small, making it difficult to train deep networks.',
    points: 30
  },
  {
    id: 'ds_adv_003',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'Which optimization algorithm adapts learning rates for each parameter?',
    options: ['SGD', 'Adam', 'Momentum', 'RMSprop'],
    correctAnswer: 1,
    explanation: 'Adam (Adaptive Moment Estimation) adapts learning rates for each parameter individually.',
    points: 30
  },
  {
    id: 'ds_adv_004',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'What is the purpose of batch normalization?',
    options: ['Reduce overfitting', 'Stabilize training', 'Increase model size', 'Reduce training time'],
    correctAnswer: 1,
    explanation: 'Batch normalization normalizes inputs to each layer, stabilizing and accelerating training.',
    points: 30
  },
  {
    id: 'ds_adv_005',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'Which technique is used in Transformer models for attention?',
    options: ['Self-attention', 'Cross-attention', 'Multi-head attention', 'All of the above'],
    correctAnswer: 3,
    explanation: 'Transformer models use self-attention, cross-attention, and multi-head attention mechanisms.',
    points: 30
  },
  {
    id: 'ds_adv_006',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'What is the difference between L1 and L2 regularization?',
    options: ['L1 creates sparse models, L2 shrinks weights', 'L2 creates sparse models, L1 shrinks weights', 'No difference', 'L1 is faster'],
    correctAnswer: 0,
    explanation: 'L1 regularization can create sparse models by setting weights to zero, while L2 shrinks weights towards zero.',
    points: 30
  },
  {
    id: 'ds_adv_007',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'Which technique is used for hyperparameter optimization?',
    options: ['Grid search', 'Random search', 'Bayesian optimization', 'All of the above'],
    correctAnswer: 3,
    explanation: 'Grid search, random search, and Bayesian optimization are all techniques for hyperparameter tuning.',
    points: 30
  },
  {
    id: 'ds_adv_008',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'What is the purpose of dropout in neural networks?',
    options: ['Increase model size', 'Prevent overfitting', 'Speed up training', 'Improve accuracy'],
    correctAnswer: 1,
    explanation: 'Dropout randomly sets some neurons to zero during training to prevent overfitting.',
    points: 30
  },
  {
    id: 'ds_adv_009',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'Which loss function is used for multi-class classification?',
    options: ['Binary cross-entropy', 'Categorical cross-entropy', 'Mean squared error', 'Hinge loss'],
    correctAnswer: 1,
    explanation: 'Categorical cross-entropy is the standard loss function for multi-class classification problems.',
    points: 30
  },
  {
    id: 'ds_adv_010',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'What is transfer learning?',
    options: ['Training from scratch', 'Using pre-trained models', 'Transferring data', 'Moving models'],
    correctAnswer: 1,
    explanation: 'Transfer learning involves using pre-trained models and adapting them for new tasks.',
    points: 30
  },
  {
    id: 'ds_adv_011',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'Which technique is used for time series forecasting?',
    options: ['ARIMA', 'LSTM', 'Prophet', 'All of the above'],
    correctAnswer: 3,
    explanation: 'ARIMA, LSTM, and Prophet are all popular techniques for time series forecasting.',
    points: 30
  },
  {
    id: 'ds_adv_012',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'What is the purpose of GANs (Generative Adversarial Networks)?',
    options: ['Classification', 'Regression', 'Generate new data', 'Clustering'],
    correctAnswer: 2,
    explanation: 'GANs are used to generate new, synthetic data that resembles the training data.',
    points: 30
  },
  {
    id: 'ds_adv_013',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'Which technique is used for anomaly detection?',
    options: ['Isolation Forest', 'One-Class SVM', 'Autoencoders', 'All of the above'],
    correctAnswer: 3,
    explanation: 'Isolation Forest, One-Class SVM, and Autoencoders are all effective for anomaly detection.',
    points: 30
  },
  {
    id: 'ds_adv_014',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'What is the curse of dimensionality?',
    options: ['Too few features', 'Too many features causing sparsity', 'Slow training', 'Poor visualization'],
    correctAnswer: 1,
    explanation: 'The curse of dimensionality refers to problems that arise when working with high-dimensional data.',
    points: 30
  },
  {
    id: 'ds_adv_015',
    category: 'Data Science',
    difficulty: 'Advanced',
    question: 'Which technique is used for feature selection?',
    options: ['Recursive Feature Elimination', 'LASSO', 'Mutual Information', 'All of the above'],
    correctAnswer: 3,
    explanation: 'RFE, LASSO, and Mutual Information are all techniques for selecting the most relevant features.',
    points: 30
  },

  // Marketing Questions - Beginner Level (15 questions)
  {
    id: 'mk_beg_001',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What does CTR stand for in digital marketing?',
    options: ['Click Through Rate', 'Cost To Revenue', 'Customer Target Reach', 'Content Traffic Ratio'],
    correctAnswer: 0,
    explanation: 'CTR (Click Through Rate) measures the percentage of people who click on a specific link out of the total who view it.',
    points: 10
  },
  {
    id: 'mk_beg_002',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'Which platform is best for B2B marketing?',
    options: ['Instagram', 'TikTok', 'LinkedIn', 'Snapchat'],
    correctAnswer: 2,
    explanation: 'LinkedIn is the premier platform for B2B marketing due to its professional user base and business-focused features.',
    points: 10
  },
  {
    id: 'mk_beg_003',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What does SEO stand for?',
    options: ['Search Engine Optimization', 'Social Engagement Optimization', 'Site Enhancement Operations', 'Search Engagement Optimization'],
    correctAnswer: 0,
    explanation: 'SEO stands for Search Engine Optimization, the practice of improving website visibility in search results.',
    points: 10
  },
  {
    id: 'mk_beg_004',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'Which of these is a social media platform?',
    options: ['Google Analytics', 'Facebook', 'Mailchimp', 'Salesforce'],
    correctAnswer: 1,
    explanation: 'Facebook is a social media platform used for connecting people and businesses.',
    points: 10
  },
  {
    id: 'mk_beg_005',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What is a target audience?',
    options: ['Everyone who uses the internet', 'A specific group of people you want to reach', 'Your competitors', 'Your employees'],
    correctAnswer: 1,
    explanation: 'A target audience is a specific group of people most likely to be interested in your product or service.',
    points: 10
  },
  {
    id: 'mk_beg_006',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What does CTA stand for?',
    options: ['Call To Action', 'Customer Target Analysis', 'Content Traffic Analytics', 'Click Through Analytics'],
    correctAnswer: 0,
    explanation: 'CTA stands for Call To Action, prompting users to take a specific action like "Buy Now" or "Sign Up".',
    points: 10
  },
  {
    id: 'mk_beg_007',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'Which metric measures brand awareness?',
    options: ['Revenue', 'Impressions', 'Profit margin', 'Customer service calls'],
    correctAnswer: 1,
    explanation: 'Impressions measure how many times your content is displayed, indicating brand awareness reach.',
    points: 10
  },
  {
    id: 'mk_beg_008',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What is email marketing?',
    options: ['Sending spam emails', 'Sending targeted emails to prospects and customers', 'Only sending newsletters', 'Automated responses only'],
    correctAnswer: 1,
    explanation: 'Email marketing involves sending targeted, relevant emails to prospects and customers to build relationships.',
    points: 10
  },
  {
    id: 'mk_beg_009',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What is content marketing?',
    options: ['Only writing blog posts', 'Creating valuable content to attract customers', 'Copying competitor content', 'Only making videos'],
    correctAnswer: 1,
    explanation: 'Content marketing involves creating and sharing valuable content to attract and engage a target audience.',
    points: 10
  },
  {
    id: 'mk_beg_010',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What does ROI stand for in marketing?',
    options: ['Return on Investment', 'Rate of Interest', 'Revenue over Income', 'Reach of Influence'],
    correctAnswer: 0,
    explanation: 'ROI (Return on Investment) measures the profitability of marketing campaigns.',
    points: 10
  },
  {
    id: 'mk_beg_011',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'Which is an example of paid advertising?',
    options: ['Organic social media posts', 'Google Ads', 'Word of mouth', 'Press releases'],
    correctAnswer: 1,
    explanation: 'Google Ads is a form of paid advertising where you pay for ad placement in search results.',
    points: 10
  },
  {
    id: 'mk_beg_012',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What is a marketing funnel?',
    options: ['A physical tool', 'The customer journey from awareness to purchase', 'A type of advertisement', 'A social media strategy'],
    correctAnswer: 1,
    explanation: 'A marketing funnel represents the customer journey from initial awareness to final purchase.',
    points: 10
  },
  {
    id: 'mk_beg_013',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What is influencer marketing?',
    options: ['Marketing to executives', 'Partnering with people who have large followings', 'Marketing expensive products', 'Marketing to decision makers'],
    correctAnswer: 1,
    explanation: 'Influencer marketing involves partnering with individuals who have influence over potential customers.',
    points: 10
  },
  {
    id: 'mk_beg_014',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What is a brand?',
    options: ['Just a logo', 'The overall perception of a company', 'Only the company name', 'The product packaging'],
    correctAnswer: 1,
    explanation: 'A brand encompasses the overall perception, reputation, and identity of a company or product.',
    points: 10
  },
  {
    id: 'mk_beg_015',
    category: 'Marketing',
    difficulty: 'Beginner',
    question: 'What is market research?',
    options: ['Studying competitors only', 'Gathering information about target markets and customers', 'Only looking at sales data', 'Researching product features'],
    correctAnswer: 1,
    explanation: 'Market research involves gathering information about target markets, customers, and industry trends.',
    points: 10
  },

  // Marketing Questions - Intermediate Level (15 questions)
  {
    id: 'mk_int_001',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is the primary goal of A/B testing in marketing?',
    options: ['Reduce costs', 'Compare two versions to determine which performs better', 'Increase traffic', 'Improve SEO'],
    correctAnswer: 1,
    explanation: 'A/B testing compares two versions of a marketing element to determine which one performs better with your audience.',
    points: 20
  },
  {
    id: 'mk_int_002',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is customer lifetime value (CLV)?',
    options: ['How long a customer lives', 'Total revenue from a customer over their relationship', 'Customer satisfaction score', 'Number of purchases'],
    correctAnswer: 1,
    explanation: 'CLV represents the total revenue a business can expect from a customer throughout their relationship.',
    points: 20
  },
  {
    id: 'mk_int_003',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is conversion rate optimization (CRO)?',
    options: ['Increasing website traffic', 'Improving the percentage of visitors who take desired actions', 'Reducing bounce rate', 'Increasing page load speed'],
    correctAnswer: 1,
    explanation: 'CRO focuses on improving the percentage of website visitors who complete desired actions.',
    points: 20
  },
  {
    id: 'mk_int_004',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is programmatic advertising?',
    options: ['Manual ad buying', 'Automated ad buying using algorithms', 'Only display advertising', 'Social media advertising'],
    correctAnswer: 1,
    explanation: 'Programmatic advertising uses automated technology and algorithms to buy and place ads in real-time.',
    points: 20
  },
  {
    id: 'mk_int_005',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is retargeting in digital marketing?',
    options: ['Targeting new customers', 'Showing ads to people who previously visited your website', 'Changing target demographics', 'Targeting competitors customers'],
    correctAnswer: 1,
    explanation: 'Retargeting shows ads to people who have previously interacted with your website or brand.',
    points: 20
  },
  {
    id: 'mk_int_006',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is marketing automation?',
    options: ['Fully automated marketing', 'Using software to automate repetitive marketing tasks', 'AI-generated content only', 'Automated customer service'],
    correctAnswer: 1,
    explanation: 'Marketing automation uses software to automate repetitive marketing tasks like email campaigns and social media posting.',
    points: 20
  },
  {
    id: 'mk_int_007',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is the difference between reach and impressions?',
    options: ['No difference', 'Reach is unique viewers, impressions is total views', 'Reach is paid, impressions is organic', 'Reach is social media, impressions is search'],
    correctAnswer: 1,
    explanation: 'Reach measures unique people who see your content, while impressions count total views including repeat views.',
    points: 20
  },
  {
    id: 'mk_int_008',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is lead scoring?',
    options: ['Rating lead quality', 'Counting total leads', 'Lead generation cost', 'Lead conversion time'],
    correctAnswer: 0,
    explanation: 'Lead scoring assigns values to leads based on their likelihood to convert into customers.',
    points: 20
  },
  {
    id: 'mk_int_009',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is omnichannel marketing?',
    options: ['Using only one channel', 'Integrated experience across all channels', 'Only digital channels', 'Only offline channels'],
    correctAnswer: 1,
    explanation: 'Omnichannel marketing provides a seamless, integrated customer experience across all touchpoints.',
    points: 20
  },
  {
    id: 'mk_int_010',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is customer acquisition cost (CAC)?',
    options: ['Cost to retain customers', 'Cost to acquire new customers', 'Customer service costs', 'Product development costs'],
    correctAnswer: 1,
    explanation: 'CAC measures the total cost of acquiring a new customer, including marketing and sales expenses.',
    points: 20
  },
  {
    id: 'mk_int_011',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is growth hacking?',
    options: ['Illegal marketing tactics', 'Rapid experimentation to grow business', 'Only startup marketing', 'Hacking competitor systems'],
    correctAnswer: 1,
    explanation: 'Growth hacking uses creative, low-cost strategies and rapid experimentation to grow businesses quickly.',
    points: 20
  },
  {
    id: 'mk_int_012',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is native advertising?',
    options: ['Ads in native language', 'Ads that match platform content format', 'Local advertising', 'Traditional advertising'],
    correctAnswer: 1,
    explanation: 'Native advertising blends seamlessly with the platform content, appearing less intrusive than traditional ads.',
    points: 20
  },
  {
    id: 'mk_int_013',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is marketing mix (4Ps)?',
    options: ['Product, Price, Place, Promotion', 'People, Process, Physical, Performance', 'Plan, Prepare, Present, Perform', 'Profit, Purpose, People, Planet'],
    correctAnswer: 0,
    explanation: 'The marketing mix consists of Product, Price, Place, and Promotion - the four key elements of marketing strategy.',
    points: 20
  },
  {
    id: 'mk_int_014',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is churn rate?',
    options: ['Customer acquisition rate', 'Rate at which customers stop doing business', 'Revenue growth rate', 'Marketing campaign success rate'],
    correctAnswer: 1,
    explanation: 'Churn rate measures the percentage of customers who stop using your product or service over a given period.',
    points: 20
  },
  {
    id: 'mk_int_015',
    category: 'Marketing',
    difficulty: 'Intermediate',
    question: 'What is persona-based marketing?',
    options: ['Marketing to celebrities', 'Creating detailed customer profiles for targeted marketing', 'Personal marketing messages', 'One-to-one marketing'],
    correctAnswer: 1,
    explanation: 'Persona-based marketing involves creating detailed customer profiles to deliver more targeted and relevant marketing.',
    points: 20
  },

  // Marketing Questions - Advanced Level (15 questions)
  {
    id: 'mk_adv_001',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'Which attribution model gives equal credit to all touchpoints in the customer journey?',
    options: ['First-touch attribution', 'Last-touch attribution', 'Linear attribution', 'Time-decay attribution'],
    correctAnswer: 2,
    explanation: 'Linear attribution distributes equal credit across all touchpoints in the customer journey.',
    points: 30
  },
  {
    id: 'mk_adv_002',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is cohort analysis in marketing?',
    options: ['Analyzing competitor groups', 'Tracking groups of users over time', 'Analyzing product features', 'Studying market segments'],
    correctAnswer: 1,
    explanation: 'Cohort analysis tracks groups of users who share common characteristics over time to understand behavior patterns.',
    points: 30
  },
  {
    id: 'mk_adv_003',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is predictive analytics in marketing?',
    options: ['Predicting weather for campaigns', 'Using data to forecast future marketing outcomes', 'Predicting competitor moves', 'Forecasting product launches'],
    correctAnswer: 1,
    explanation: 'Predictive analytics uses historical data and machine learning to forecast future marketing performance and customer behavior.',
    points: 30
  },
  {
    id: 'mk_adv_004',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is marketing mix modeling (MMM)?',
    options: ['Creating marketing personas', 'Statistical analysis of marketing effectiveness', 'Mixing different marketing channels', 'Product mix optimization'],
    correctAnswer: 1,
    explanation: 'MMM uses statistical analysis to measure the impact of various marketing activities on sales and ROI.',
    points: 30
  },
  {
    id: 'mk_adv_005',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is incrementality testing?',
    options: ['Testing small changes', 'Measuring true causal impact of marketing', 'Incremental budget testing', 'Testing one variable at a time'],
    correctAnswer: 1,
    explanation: 'Incrementality testing measures the true causal impact of marketing activities by comparing test and control groups.',
    points: 30
  },
  {
    id: 'mk_adv_006',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is dynamic pricing in marketing?',
    options: ['Fixed pricing strategy', 'Adjusting prices based on real-time market conditions', 'Discount pricing only', 'Premium pricing strategy'],
    correctAnswer: 1,
    explanation: 'Dynamic pricing adjusts prices in real-time based on demand, competition, and other market factors.',
    points: 30
  },
  {
    id: 'mk_adv_007',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is cross-channel attribution?',
    options: ['Attribution within single channel', 'Tracking customer journey across multiple channels', 'Cross-selling attribution', 'Channel conflict resolution'],
    correctAnswer: 1,
    explanation: 'Cross-channel attribution tracks and assigns credit to touchpoints across multiple marketing channels.',
    points: 30
  },
  {
    id: 'mk_adv_008',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is real-time personalization?',
    options: ['Personalizing content in real-time based on user behavior', 'Personal customer service', 'Real-time customer feedback', 'Live chat personalization'],
    correctAnswer: 0,
    explanation: 'Real-time personalization dynamically customizes content and experiences based on current user behavior and context.',
    points: 30
  },
  {
    id: 'mk_adv_009',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is lookalike modeling?',
    options: ['Creating similar products', 'Finding prospects similar to best customers', 'Copying competitor strategies', 'Visual similarity analysis'],
    correctAnswer: 1,
    explanation: 'Lookalike modeling identifies prospects who share characteristics with your best existing customers.',
    points: 30
  },
  {
    id: 'mk_adv_010',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is marketing data unification?',
    options: ['Combining all marketing data into single view', 'Unifying marketing teams', 'Standardizing marketing messages', 'Unifying marketing budgets'],
    correctAnswer: 0,
    explanation: 'Marketing data unification combines data from multiple sources to create a single, comprehensive view of marketing performance.',
    points: 30
  },
  {
    id: 'mk_adv_011',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is contextual advertising?',
    options: ['Advertising based on page content', 'Advertising in context of user location', 'Advertising during specific events', 'Advertising based on user context'],
    correctAnswer: 0,
    explanation: 'Contextual advertising displays ads relevant to the content of the webpage or app where they appear.',
    points: 30
  },
  {
    id: 'mk_adv_012',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is customer data platform (CDP)?',
    options: ['Customer service platform', 'Unified customer data management system', 'Customer feedback platform', 'Customer communication platform'],
    correctAnswer: 1,
    explanation: 'A CDP creates a unified, persistent customer database accessible to other marketing technology systems.',
    points: 30
  },
  {
    id: 'mk_adv_013',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is propensity modeling?',
    options: ['Modeling customer preferences', 'Predicting likelihood of customer actions', 'Modeling product features', 'Modeling market trends'],
    correctAnswer: 1,
    explanation: 'Propensity modeling predicts the likelihood that customers will take specific actions like purchasing or churning.',
    points: 30
  },
  {
    id: 'mk_adv_014',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is zero-party data?',
    options: ['Data with no cost', 'Data customers intentionally share', 'Anonymous data', 'Third-party data'],
    correctAnswer: 1,
    explanation: 'Zero-party data is information customers intentionally and proactively share with brands.',
    points: 30
  },
  {
    id: 'mk_adv_015',
    category: 'Marketing',
    difficulty: 'Advanced',
    question: 'What is algorithmic attribution?',
    options: ['Manual attribution process', 'Machine learning-based attribution modeling', 'Simple rule-based attribution', 'Last-click attribution'],
    correctAnswer: 1,
    explanation: 'Algorithmic attribution uses machine learning to analyze all touchpoints and assign credit based on their actual contribution.',
    points: 30
  },

  // Finance Questions - Beginner Level (15 questions)
  {
    id: 'fn_beg_001',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What does ROI stand for?',
    options: ['Return on Investment', 'Rate of Interest', 'Revenue over Income', 'Risk of Investment'],
    correctAnswer: 0,
    explanation: 'ROI (Return on Investment) measures the efficiency of an investment by comparing gain to cost.',
    points: 10
  },
  {
    id: 'fn_beg_002',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is compound interest?',
    options: ['Interest on principal only', 'Interest on principal and accumulated interest', 'Simple interest calculation', 'Bank service fee'],
    correctAnswer: 1,
    explanation: 'Compound interest is interest calculated on both the principal amount and previously earned interest.',
    points: 10
  },
  {
    id: 'fn_beg_003',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is a budget?',
    options: ['A spending limit', 'A plan for income and expenses', 'A savings account', 'A type of loan'],
    correctAnswer: 1,
    explanation: 'A budget is a financial plan that outlines expected income and expenses over a specific period.',
    points: 10
  },
  {
    id: 'fn_beg_004',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is an emergency fund?',
    options: ['Money for vacations', 'Money set aside for unexpected expenses', 'Investment portfolio', 'Retirement savings'],
    correctAnswer: 1,
    explanation: 'An emergency fund is money saved specifically for unexpected financial emergencies.',
    points: 10
  },
  {
    id: 'fn_beg_005',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is a credit score?',
    options: ['Your bank balance', 'A measure of creditworthiness', 'Your income level', 'Your age'],
    correctAnswer: 1,
    explanation: 'A credit score is a numerical representation of your creditworthiness based on credit history.',
    points: 10
  },
  {
    id: 'fn_beg_006',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is inflation?',
    options: ['Decrease in prices', 'Increase in general price levels', 'Stock market growth', 'Currency exchange'],
    correctAnswer: 1,
    explanation: 'Inflation is the general increase in prices of goods and services over time.',
    points: 10
  },
  {
    id: 'fn_beg_007',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is a stock?',
    options: ['A type of bond', 'Ownership share in a company', 'A savings account', 'A type of loan'],
    correctAnswer: 1,
    explanation: 'A stock represents ownership shares in a corporation, giving shareholders voting rights and potential dividends.',
    points: 10
  },
  {
    id: 'fn_beg_008',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is diversification in investing?',
    options: ['Buying only one stock', 'Spreading investments across different assets', 'Investing only in bonds', 'Keeping money in cash'],
    correctAnswer: 1,
    explanation: 'Diversification means spreading investments across different assets to reduce risk.',
    points: 10
  },
  {
    id: 'fn_beg_009',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is a 401(k)?',
    options: ['A type of loan', 'An employer-sponsored retirement plan', 'A credit card', 'A savings account'],
    correctAnswer: 1,
    explanation: 'A 401(k) is an employer-sponsored retirement savings plan with tax advantages.',
    points: 10
  },
  {
    id: 'fn_beg_010',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is the difference between a debit and credit card?',
    options: ['No difference', 'Debit uses your money, credit borrows money', 'Credit is safer', 'Debit has higher fees'],
    correctAnswer: 1,
    explanation: 'A debit card uses money from your bank account, while a credit card borrows money that you must repay.',
    points: 10
  },
  {
    id: 'fn_beg_011',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is net worth?',
    options: ['Your salary', 'Assets minus liabilities', 'Your credit score', 'Your monthly expenses'],
    correctAnswer: 1,
    explanation: 'Net worth is calculated by subtracting your total liabilities from your total assets.',
    points: 10
  },
  {
    id: 'fn_beg_012',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is a mortgage?',
    options: ['A type of insurance', 'A loan to buy real estate', 'A savings plan', 'A credit card'],
    correctAnswer: 1,
    explanation: 'A mortgage is a loan specifically used to purchase real estate, secured by the property itself.',
    points: 10
  },
  {
    id: 'fn_beg_013',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is APR?',
    options: ['Annual Percentage Rate', 'Average Payment Rate', 'Annual Profit Rate', 'Asset Purchase Rate'],
    correctAnswer: 0,
    explanation: 'APR (Annual Percentage Rate) represents the yearly cost of borrowing money, including interest and fees.',
    points: 10
  },
  {
    id: 'fn_beg_014',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is a mutual fund?',
    options: ['A bank account', 'A pooled investment vehicle', 'A type of loan', 'An insurance policy'],
    correctAnswer: 1,
    explanation: 'A mutual fund pools money from many investors to purchase a diversified portfolio of securities.',
    points: 10
  },
  {
    id: 'fn_beg_015',
    category: 'Finance',
    difficulty: 'Beginner',
    question: 'What is the purpose of insurance?',
    options: ['To make money', 'To protect against financial loss', 'To avoid taxes', 'To increase income'],
    correctAnswer: 1,
    explanation: 'Insurance provides financial protection against potential losses or damages.',
    points: 10
  },

  // Finance Questions - Intermediate Level (15 questions)
  {
    id: 'fn_int_001',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is the time value of money principle?',
    options: ['Money loses value over time', 'Money available now is worth more than the same amount in the future', 'Interest rates always increase', 'Inflation is always positive'],
    correctAnswer: 1,
    explanation: 'The time value of money principle states that money available now is worth more than the same amount in the future due to its earning potential.',
    points: 20
  },
  {
    id: 'fn_int_002',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is the debt-to-equity ratio?',
    options: ['Total debt divided by total equity', 'Total equity divided by total debt', 'Total assets divided by total debt', 'Total income divided by total debt'],
    correctAnswer: 0,
    explanation: 'The debt-to-equity ratio measures a company\'s financial leverage by dividing total debt by total equity.',
    points: 20
  },
  {
    id: 'fn_int_003',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is dollar-cost averaging?',
    options: ['Buying stocks at lowest price', 'Investing fixed amounts regularly regardless of price', 'Averaging stock prices', 'Converting currencies'],
    correctAnswer: 1,
    explanation: 'Dollar-cost averaging involves investing a fixed amount regularly, regardless of market conditions.',
    points: 20
  },
  {
    id: 'fn_int_004',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is a P/E ratio?',
    options: ['Price to Earnings ratio', 'Profit to Expense ratio', 'Price to Equity ratio', 'Performance to Expectation ratio'],
    correctAnswer: 0,
    explanation: 'P/E ratio compares a company\'s stock price to its earnings per share, indicating valuation.',
    points: 20
  },
  {
    id: 'fn_int_005',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is beta in finance?',
    options: ['A type of stock', 'A measure of volatility relative to market', 'A financial ratio', 'A bond rating'],
    correctAnswer: 1,
    explanation: 'Beta measures how much a stock\'s price moves relative to the overall market.',
    points: 20
  },
  {
    id: 'fn_int_006',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is a REIT?',
    options: ['Real Estate Investment Trust', 'Retirement Equity Investment Tool', 'Risk Evaluation Investment Type', 'Regional Economic Investment Trust'],
    correctAnswer: 0,
    explanation: 'A REIT is a company that owns, operates, or finances income-producing real estate.',
    points: 20
  },
  {
    id: 'fn_int_007',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is a bond yield?',
    options: ['Bond price', 'Annual return on bond investment', 'Bond maturity date', 'Bond credit rating'],
    correctAnswer: 1,
    explanation: 'Bond yield represents the annual return an investor receives from holding a bond.',
    points: 20
  },
  {
    id: 'fn_int_008',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is market capitalization?',
    options: ['Company revenue', 'Total value of company shares', 'Company profit', 'Company assets'],
    correctAnswer: 1,
    explanation: 'Market capitalization is the total value of a company\'s outstanding shares in the stock market.',
    points: 20
  },
  {
    id: 'fn_int_009',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is a dividend yield?',
    options: ['Annual dividends per share divided by stock price', 'Total dividends paid', 'Stock price appreciation', 'Company profit margin'],
    correctAnswer: 0,
    explanation: 'Dividend yield is calculated by dividing annual dividends per share by the stock price.',
    points: 20
  },
  {
    id: 'fn_int_010',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is asset allocation?',
    options: ['Buying only stocks', 'Distributing investments among different asset classes', 'Selling all assets', 'Focusing on one investment'],
    correctAnswer: 1,
    explanation: 'Asset allocation involves distributing investments among different asset classes like stocks, bonds, and cash.',
    points: 20
  },
  {
    id: 'fn_int_011',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is a stop-loss order?',
    options: ['Order to buy stocks', 'Order to sell stock when price falls to certain level', 'Order to hold stocks', 'Order to increase position'],
    correctAnswer: 1,
    explanation: 'A stop-loss order automatically sells a stock when its price falls to a predetermined level.',
    points: 20
  },
  {
    id: 'fn_int_012',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is liquidity in finance?',
    options: ['How much cash you have', 'How easily an asset can be converted to cash', 'How profitable an investment is', 'How risky an investment is'],
    correctAnswer: 1,
    explanation: 'Liquidity refers to how quickly and easily an asset can be converted into cash without affecting its price.',
    points: 20
  },
  {
    id: 'fn_int_013',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is a credit spread?',
    options: ['Difference between credit card rates', 'Difference in yield between bonds of different credit quality', 'Credit limit increase', 'Credit score range'],
    correctAnswer: 1,
    explanation: 'A credit spread is the difference in yield between bonds of different credit qualities but similar maturities.',
    points: 20
  },
  {
    id: 'fn_int_014',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is working capital?',
    options: ['Total capital', 'Current assets minus current liabilities', 'Long-term investments', 'Fixed assets'],
    correctAnswer: 1,
    explanation: 'Working capital is calculated by subtracting current liabilities from current assets, measuring short-term financial health.',
    points: 20
  },
  {
    id: 'fn_int_015',
    category: 'Finance',
    difficulty: 'Intermediate',
    question: 'What is cash flow?',
    options: ['Money in the bank', 'Money coming in and going out', 'Investment returns', 'Credit limit'],
    correctAnswer: 1,
    explanation: 'Cash flow refers to the movement of money in and out of your accounts over a period of time.',
    points: 20
  },

  // Finance Questions - Advanced Level (15 questions)
  {
    id: 'fn_adv_001',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is the Black-Scholes model used for?',
    options: ['Stock picking', 'Option pricing', 'Risk assessment', 'Portfolio optimization'],
    correctAnswer: 1,
    explanation: 'The Black-Scholes model is a mathematical model for pricing options contracts.',
    points: 30
  },
  {
    id: 'fn_adv_002',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is Value at Risk (VaR)?',
    options: ['Maximum expected loss over specific time period', 'Average portfolio return', 'Minimum required return', 'Risk-free rate'],
    correctAnswer: 0,
    explanation: 'VaR estimates the maximum expected loss of a portfolio over a specific time period at a given confidence level.',
    points: 30
  },
  {
    id: 'fn_adv_003',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is the Capital Asset Pricing Model (CAPM)?',
    options: ['Model for pricing assets', 'Model for expected return based on risk', 'Model for capital allocation', 'Model for asset depreciation'],
    correctAnswer: 1,
    explanation: 'CAPM describes the relationship between expected return and risk for securities in a well-diversified portfolio.',
    points: 30
  },
  {
    id: 'fn_adv_004',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is duration in bond analysis?',
    options: ['Time to maturity', 'Measure of price sensitivity to interest rate changes', 'Bond credit rating period', 'Coupon payment frequency'],
    correctAnswer: 1,
    explanation: 'Duration measures how much a bond\'s price will change in response to interest rate changes.',
    points: 30
  },
  {
    id: 'fn_adv_005',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is the Sharpe ratio?',
    options: ['Risk-adjusted return measure', 'Price-to-earnings ratio', 'Debt-to-equity ratio', 'Profit margin ratio'],
    correctAnswer: 0,
    explanation: 'The Sharpe ratio measures risk-adjusted return by comparing excess return to standard deviation.',
    points: 30
  },
  {
    id: 'fn_adv_006',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is convexity in bond pricing?',
    options: ['Bond shape', 'Measure of duration sensitivity to yield changes', 'Bond rating system', 'Interest payment structure'],
    correctAnswer: 1,
    explanation: 'Convexity measures how the duration of a bond changes as interest rates change.',
    points: 30
  },
  {
    id: 'fn_adv_007',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is the efficient frontier?',
    options: ['Market boundary', 'Set of optimal portfolios offering highest return for each risk level', 'Trading platform', 'Economic indicator'],
    correctAnswer: 1,
    explanation: 'The efficient frontier represents portfolios that offer the highest expected return for each level of risk.',
    points: 30
  },
  {
    id: 'fn_adv_008',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is a credit default swap (CDS)?',
    options: ['Type of bond', 'Insurance against credit default', 'Stock option', 'Currency exchange'],
    correctAnswer: 1,
    explanation: 'A CDS is a financial derivative that provides insurance against the default of a debt instrument.',
    points: 30
  },
  {
    id: 'fn_adv_009',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is the Monte Carlo simulation used for in finance?',
    options: ['Stock picking', 'Risk modeling and scenario analysis', 'Currency trading', 'Market timing'],
    correctAnswer: 1,
    explanation: 'Monte Carlo simulation uses random sampling to model and analyze complex financial scenarios and risks.',
    points: 30
  },
  {
    id: 'fn_adv_010',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is alpha in portfolio management?',
    options: ['First investment', 'Excess return above benchmark', 'Risk measure', 'Market correlation'],
    correctAnswer: 1,
    explanation: 'Alpha measures the excess return of an investment relative to the return of a benchmark index.',
    points: 30
  },
  {
    id: 'fn_adv_011',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is the Gordon Growth Model?',
    options: ['Economic growth model', 'Dividend discount model for stock valuation', 'Interest rate model', 'Inflation model'],
    correctAnswer: 1,
    explanation: 'The Gordon Growth Model values stocks based on dividends growing at a constant rate in perpetuity.',
    points: 30
  },
  {
    id: 'fn_adv_012',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is basis risk?',
    options: ['Risk of wrong basis points', 'Risk that hedge will not perfectly offset underlying position', 'Basic investment risk', 'Foundation risk'],
    correctAnswer: 1,
    explanation: 'Basis risk occurs when the hedge instrument and the underlying asset do not move in perfect correlation.',
    points: 30
  },
  {
    id: 'fn_adv_013',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is the term structure of interest rates?',
    options: ['Interest rate definitions', 'Relationship between interest rates and time to maturity', 'Rate calculation method', 'Interest payment schedule'],
    correctAnswer: 1,
    explanation: 'The term structure shows how interest rates vary with different maturities for bonds of similar credit quality.',
    points: 30
  },
  {
    id: 'fn_adv_014',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is a collateralized debt obligation (CDO)?',
    options: ['Simple bond', 'Complex security backed by pool of loans', 'Stock option', 'Insurance policy'],
    correctAnswer: 1,
    explanation: 'A CDO is a structured financial product backed by a pool of loans and other assets.',
    points: 30
  },
  {
    id: 'fn_adv_015',
    category: 'Finance',
    difficulty: 'Advanced',
    question: 'What is the Black-Litterman model?',
    options: ['Option pricing model', 'Portfolio optimization model', 'Risk assessment model', 'Market prediction model'],
    correctAnswer: 1,
    explanation: 'The Black-Litterman model is a mathematical framework for portfolio optimization that incorporates investor views.',
    points: 30
  },

  // Software Development Questions
  // Software Development Questions - Beginner Level (15 questions)  {    id: 'sd_beg_001',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What does HTML stand for?',    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],    correctAnswer: 0,    explanation: 'HTML stands for Hyper Text Markup Language, used to create web pages.',    points: 10  },  {    id: 'sd_beg_002',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What does CSS stand for?',    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],    correctAnswer: 1,    explanation: 'CSS stands for Cascading Style Sheets, used to style and layout web pages.',    points: 10  },  {    id: 'sd_beg_003',    category: 'Software Development',    difficulty: 'Beginner',    question: 'Which of these is a programming language?',    options: ['HTML', 'CSS', 'JavaScript', 'HTTP'],    correctAnswer: 2,    explanation: 'JavaScript is a programming language, while HTML and CSS are markup/styling languages, and HTTP is a protocol.',    points: 10  },  {    id: 'sd_beg_004',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What is a variable in programming?',    options: ['A fixed value', 'A container for storing data', 'A type of loop', 'A function'],    correctAnswer: 1,    explanation: 'A variable is a container that stores data values that can be changed during program execution.',    points: 10  },  {    id: 'sd_beg_005',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What is a function in programming?',    options: ['A variable', 'A reusable block of code', 'A data type', 'A loop'],    correctAnswer: 1,    explanation: 'A function is a reusable block of code that performs a specific task.',    points: 10  },  {    id: 'sd_beg_006',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What does API stand for?',    options: ['Application Programming Interface', 'Advanced Programming Integration', 'Automated Program Interaction', 'Application Process Integration'],    correctAnswer: 0,    explanation: 'API stands for Application Programming Interface, allowing different software applications to communicate.',    points: 10  },  {    id: 'sd_beg_007',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What is debugging?',    options: ['Writing code', 'Finding and fixing errors in code', 'Running code', 'Deleting code'],    correctAnswer: 1,    explanation: 'Debugging is the process of finding and fixing errors or bugs in computer code.',    points: 10  },  {    id: 'sd_beg_008',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What is a loop in programming?',    options: ['A variable', 'A function', 'A structure that repeats code', 'A data type'],    correctAnswer: 2,    explanation: 'A loop is a programming structure that repeats a block of code until a condition is met.',    points: 10  },  {    id: 'sd_beg_009',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What is version control?',    options: ['Controlling program versions', 'Managing changes to code over time', 'Controlling software versions', 'Managing program execution'],    correctAnswer: 1,    explanation: 'Version control is a system that manages changes to code over time, allowing collaboration and tracking.',    points: 10  },  {    id: 'sd_beg_010',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What is Git?',    options: ['A programming language', 'A version control system', 'A web browser', 'A database'],    correctAnswer: 1,    explanation: 'Git is a distributed version control system used to track changes in source code.',    points: 10  },  {    id: 'sd_beg_011',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What is a database?',    options: ['A programming language', 'A structured collection of data', 'A web server', 'A code editor'],    correctAnswer: 1,    explanation: 'A database is a structured collection of data that can be easily accessed, managed, and updated.',    points: 10  },  {    id: 'sd_beg_012',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What does SQL stand for?',    options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'],    correctAnswer: 0,    explanation: 'SQL stands for Structured Query Language, used to manage and query databases.',    points: 10  },  {    id: 'sd_beg_013',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What is an algorithm?',    options: ['A programming language', 'A step-by-step procedure to solve a problem', 'A data structure', 'A software tool'],    correctAnswer: 1,    explanation: 'An algorithm is a step-by-step procedure or formula for solving a problem.',    points: 10  },  {    id: 'sd_beg_014',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What is object-oriented programming?',    options: ['Programming with objects and classes', 'Programming with functions only', 'Programming with variables only', 'Programming with loops only'],    correctAnswer: 0,    explanation: 'Object-oriented programming is a paradigm based on objects and classes that contain data and methods.',    points: 10  },  {    id: 'sd_beg_015',    category: 'Software Development',    difficulty: 'Beginner',    question: 'What is a framework in software development?',    options: ['A programming language', 'A pre-written code structure to build applications', 'A database', 'A web server'],    correctAnswer: 1,    explanation: 'A framework is a pre-written code structure that provides a foundation for building applications.',    points: 10  },  // Software Development Questions - Intermediate Level (15 questions)  {    id: 'sd_int_001',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is the time complexity of binary search?',    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],    correctAnswer: 1,    explanation: 'Binary search has O(log n) time complexity as it eliminates half the search space in each iteration.',    points: 20  },  {    id: 'sd_int_002',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is polymorphism in OOP?',    options: ['Having multiple classes', 'Ability of objects to take multiple forms', 'Using multiple inheritance', 'Creating multiple methods'],    correctAnswer: 1,    explanation: 'Polymorphism allows objects of different types to be treated as instances of the same type through a common interface.',    points: 20  },  {    id: 'sd_int_003',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is a RESTful API?',    options: ['A database type', 'An architectural style for web services', 'A programming language', 'A testing framework'],    correctAnswer: 1,    explanation: 'REST (Representational State Transfer) is an architectural style for designing web services.',    points: 20  },  {    id: 'sd_int_004',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is the difference between GET and POST HTTP methods?',    options: ['No difference', 'GET retrieves data, POST sends data', 'GET is faster', 'POST is more secure'],    correctAnswer: 1,    explanation: 'GET is used to retrieve data from a server, while POST is used to send data to a server.',    points: 20  },  {    id: 'sd_int_005',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is dependency injection?',    options: ['Adding dependencies to code', 'A design pattern for providing dependencies', 'Removing dependencies', 'Testing dependencies'],    correctAnswer: 1,    explanation: 'Dependency injection is a design pattern where dependencies are provided to an object rather than created by it.',    points: 20  },  {    id: 'sd_int_006',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is a design pattern?',    options: ['UI design template', 'Reusable solution to common programming problems', 'Database schema', 'Testing strategy'],    correctAnswer: 1,    explanation: 'Design patterns are reusable solutions to commonly occurring problems in software design.',    points: 20  },  {    id: 'sd_int_007',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is the MVC pattern?',    options: ['Model-View-Controller', 'Multiple-Variable-Control', 'Master-Version-Control', 'Modern-Virtual-Computing'],    correctAnswer: 0,    explanation: 'MVC (Model-View-Controller) is an architectural pattern that separates application logic into three components.',    points: 20  },  {    id: 'sd_int_008',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is unit testing?',    options: ['Testing entire application', 'Testing individual components in isolation', 'Testing user interface', 'Testing database connections'],    correctAnswer: 1,    explanation: 'Unit testing involves testing individual components or modules of software in isolation.',    points: 20  },  {    id: 'sd_int_009',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is asynchronous programming?',    options: ['Programming without synchronization', 'Non-blocking code execution', 'Programming at different times', 'Synchronized programming'],    correctAnswer: 1,    explanation: 'Asynchronous programming allows code to run without blocking the execution of other code.',    points: 20  },  {    id: 'sd_int_010',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is a hash table?',    options: ['A type of database', 'A data structure using key-value pairs', 'A sorting algorithm', 'A programming language'],    correctAnswer: 1,    explanation: 'A hash table is a data structure that implements an associative array using key-value pairs.',    points: 20  },  {    id: 'sd_int_011',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is recursion?',    options: ['A loop structure', 'A function calling itself', 'A data type', 'An error handling method'],    correctAnswer: 1,    explanation: 'Recursion is a programming technique where a function calls itself to solve a problem.',    points: 20  },  {    id: 'sd_int_012',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is the difference between stack and queue?',    options: ['No difference', 'Stack is LIFO, Queue is FIFO', 'Stack is faster', 'Queue uses more memory'],    correctAnswer: 1,    explanation: 'Stack follows Last-In-First-Out (LIFO) principle, while Queue follows First-In-First-Out (FIFO) principle.',    points: 20  },  {    id: 'sd_int_013',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is encapsulation in OOP?',    options: ['Hiding implementation details', 'Creating multiple classes', 'Inheriting from parent class', 'Using multiple methods'],    correctAnswer: 0,    explanation: 'Encapsulation is the bundling of data and methods that operate on that data within a single unit.',    points: 20  },  {    id: 'sd_int_014',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is a callback function?',    options: ['A function that calls back', 'A function passed as argument to another function', 'A function that returns a value', 'A recursive function'],    correctAnswer: 1,    explanation: 'A callback function is a function passed as an argument to another function and executed later.',    points: 20  },  {    id: 'sd_int_015',    category: 'Software Development',    difficulty: 'Intermediate',    question: 'What is Big O notation?',    options: ['A programming language', 'Mathematical notation for algorithm complexity', 'A data structure', 'A design pattern'],    correctAnswer: 1,    explanation: 'Big O notation describes the computational complexity of algorithms in terms of time and space.',    points: 20  },  // Software Development Questions - Advanced Level (15 questions)  {    id: 'sd_adv_001',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is the CAP theorem in distributed systems?',    options: ['Consistency, Availability, Partition tolerance', 'Concurrency, Atomicity, Performance', 'Caching, Authentication, Persistence', 'Clustering, Aggregation, Partitioning'],    correctAnswer: 0,    explanation: 'CAP theorem states that distributed systems can only guarantee two of three: Consistency, Availability, and Partition tolerance.',    points: 30  },  {    id: 'sd_adv_002',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is eventual consistency?',    options: ['Immediate consistency', 'System becomes consistent over time', 'Never consistent', 'Always consistent'],    correctAnswer: 1,    explanation: 'Eventual consistency means the system will become consistent over time, without guaranteeing immediate consistency.',    points: 30  },  {    id: 'sd_adv_003',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is a microservice architecture?',    options: ['Small applications', 'Architecture with loosely coupled services', 'Miniature software', 'Reduced functionality apps'],    correctAnswer: 1,    explanation: 'Microservice architecture structures an application as a collection of loosely coupled services.',    points: 30  },  {    id: 'sd_adv_004',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is the Actor model in concurrent programming?',    options: ['A design pattern', 'Mathematical model for concurrent computation', 'A testing framework', 'A database model'],    correctAnswer: 1,    explanation: 'The Actor model treats actors as universal primitives of concurrent computation.',    points: 30  },  {    id: 'sd_adv_005',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is CQRS?',    options: ['Command Query Responsibility Segregation', 'Concurrent Query Response System', 'Complex Query Result Set', 'Centralized Query Resource System'],    correctAnswer: 0,    explanation: 'CQRS separates read and write operations for a data store, using different models for updating and reading data.',    points: 30  },  {    id: 'sd_adv_006',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is event sourcing?',    options: ['Finding event sources', 'Storing state changes as sequence of events', 'Event-driven programming', 'Source code events'],    correctAnswer: 1,    explanation: 'Event sourcing stores the state of a business entity as a sequence of state-changing events.',    points: 30  },  {    id: 'sd_adv_007',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is the Saga pattern?',    options: ['A story pattern', 'Managing distributed transactions', 'A design pattern for UI', 'A testing pattern'],    correctAnswer: 1,    explanation: 'The Saga pattern manages distributed transactions by breaking them into a series of smaller transactions.',    points: 30  },  {    id: 'sd_adv_008',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is domain-driven design (DDD)?',    options: ['Database design approach', 'Software design approach focused on business domain', 'UI design methodology', 'Testing methodology'],    correctAnswer: 1,    explanation: 'DDD is an approach to software development that centers the development on programming a domain model.',    points: 30  },  {    id: 'sd_adv_009',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is the difference between optimistic and pessimistic locking?',    options: ['No difference', 'Optimistic assumes no conflicts, pessimistic locks immediately', 'Optimistic is faster', 'Pessimistic is more secure'],    correctAnswer: 1,    explanation: 'Optimistic locking assumes conflicts are rare and checks at commit time, while pessimistic locking locks resources immediately.',    points: 30  },  {    id: 'sd_adv_010',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is a distributed hash table (DHT)?',    options: ['Hash table in database', 'Decentralized distributed system for key-value storage', 'Hash function for distribution', 'Table with hash values'],    correctAnswer: 1,    explanation: 'A DHT is a decentralized distributed system that provides a lookup service similar to a hash table.',    points: 30  },  {    id: 'sd_adv_011',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is the Byzantine Generals Problem?',    options: ['Military strategy problem', 'Consensus problem in distributed computing', 'Algorithm optimization problem', 'Network routing problem'],    correctAnswer: 1,    explanation: 'The Byzantine Generals Problem illustrates the difficulty of achieving consensus in distributed systems with unreliable communication.',    points: 30  },  {    id: 'sd_adv_012',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is functional programming?',    options: ['Programming with functions only', 'Programming paradigm based on mathematical functions', 'Programming that works', 'Programming with procedures'],    correctAnswer: 1,    explanation: 'Functional programming is a paradigm that treats computation as evaluation of mathematical functions.',    points: 30  },  {    id: 'sd_adv_013',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is a monad in functional programming?',    options: ['A single unit', 'A design pattern for handling computations', 'A type of function', 'A data structure'],    correctAnswer: 1,    explanation: 'A monad is a design pattern that provides a way to wrap values and chain operations on wrapped values.',    points: 30  },  {    id: 'sd_adv_014',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is the difference between horizontal and vertical scaling?',    options: ['No difference', 'Horizontal adds more machines, vertical adds more power', 'Horizontal is cheaper', 'Vertical is more reliable'],    correctAnswer: 1,    explanation: 'Horizontal scaling adds more machines to the pool of resources, while vertical scaling adds more power to existing machines.',    points: 30  },  {    id: 'sd_adv_015',    category: 'Software Development',    difficulty: 'Advanced',    question: 'What is the Two-Phase Commit protocol?',    options: ['Version control protocol', 'Distributed transaction protocol', 'Database backup protocol', 'Network communication protocol'],    correctAnswer: 1,    explanation: 'Two-Phase Commit is a distributed algorithm that coordinates all processes participating in a distributed atomic transaction.',    points: 30  },

  // Project Management Questions - Beginner Level (15 questions)
  {
    id: 'pm_beg_001',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What does the acronym SMART stand for in goal setting?',
    options: ['Simple, Measurable, Achievable, Relevant, Timely', 'Specific, Measurable, Achievable, Relevant, Time-bound', 'Strategic, Meaningful, Actionable, Realistic, Trackable', 'Structured, Manageable, Attainable, Results-oriented, Targeted'],
    correctAnswer: 1,
    explanation: 'SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound.',
    points: 10
  },
  {
    id: 'pm_beg_002',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is a project scope?',
    options: ['Project budget', 'Project timeline', 'Work that needs to be accomplished', 'Project team size'],
    correctAnswer: 2,
    explanation: 'Project scope defines the work that needs to be accomplished to deliver a product or service.',
    points: 10
  },
  {
    id: 'pm_beg_003',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is a milestone in project management?',
    options: ['A significant point in the project', 'A project deliverable', 'A project risk', 'A project resource'],
    correctAnswer: 0,
    explanation: 'A milestone is a significant point or event in a project timeline.',
    points: 10
  },
  {
    id: 'pm_beg_004',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What does WBS stand for?',
    options: ['Work Breakdown Structure', 'Weekly Business Summary', 'Work Budget System', 'Weekly Breakdown Schedule'],
    correctAnswer: 0,
    explanation: 'WBS stands for Work Breakdown Structure, a hierarchical decomposition of project work.',
    points: 10
  },
  {
    id: 'pm_beg_005',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is a Gantt chart?',
    options: ['A budget tracking tool', 'A visual project schedule', 'A risk assessment matrix', 'A team communication tool'],
    correctAnswer: 1,
    explanation: 'A Gantt chart is a visual representation of a project schedule showing tasks over time.',
    points: 10
  },
  {
    id: 'pm_beg_006',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is the critical path in project management?',
    options: ['The most expensive tasks', 'The longest sequence of dependent tasks', 'The most risky tasks', 'The most important tasks'],
    correctAnswer: 1,
    explanation: 'The critical path is the longest sequence of dependent tasks that determines project duration.',
    points: 10
  },
  {
    id: 'pm_beg_007',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is a stakeholder?',
    options: ['Project team member', 'Anyone affected by the project', 'Project sponsor only', 'Project manager only'],
    correctAnswer: 1,
    explanation: 'A stakeholder is anyone who is affected by or can affect the project.',
    points: 10
  },
  {
    id: 'pm_beg_008',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is project risk?',
    options: ['Certain negative events', 'Uncertain events that can impact the project', 'Project costs', 'Project timeline'],
    correctAnswer: 1,
    explanation: 'Project risk refers to uncertain events that can have positive or negative impacts on project objectives.',
    points: 10
  },
  {
    id: 'pm_beg_009',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is a project charter?',
    options: ['Project budget', 'Document that formally authorizes a project', 'Project schedule', 'Project team list'],
    correctAnswer: 1,
    explanation: 'A project charter is a document that formally authorizes the existence of a project.',
    points: 10
  },
  {
    id: 'pm_beg_010',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What does ROI stand for?',
    options: ['Return on Investment', 'Rate of Interest', 'Risk of Implementation', 'Resource Optimization Index'],
    correctAnswer: 0,
    explanation: 'ROI stands for Return on Investment, measuring the efficiency of an investment.',
    points: 10
  },
  {
    id: 'pm_beg_011',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is scope creep?',
    options: ['Reducing project scope', 'Uncontrolled expansion of project scope', 'Planning project scope', 'Documenting project scope'],
    correctAnswer: 1,
    explanation: 'Scope creep is the uncontrolled expansion or addition of features to a project scope.',
    points: 10
  },
  {
    id: 'pm_beg_012',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is a deliverable?',
    options: ['Project meeting', 'Tangible or intangible output of a project', 'Project budget', 'Project timeline'],
    correctAnswer: 1,
    explanation: 'A deliverable is any tangible or intangible output produced as a result of project work.',
    points: 10
  },
  {
    id: 'pm_beg_013',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is the project lifecycle?',
    options: ['Project budget phases', 'Series of phases a project goes through', 'Project team changes', 'Project risk stages'],
    correctAnswer: 1,
    explanation: 'The project lifecycle is the series of phases that a project passes through from initiation to closure.',
    points: 10
  },
  {
    id: 'pm_beg_014',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is quality assurance in projects?',
    options: ['Testing final products', 'Process of ensuring quality standards are met', 'Fixing defects', 'Measuring project success'],
    correctAnswer: 1,
    explanation: 'Quality assurance is the process of ensuring that quality standards and procedures are followed.',
    points: 10
  },
  {
    id: 'pm_beg_015',
    category: 'Project Management',
    difficulty: 'Beginner',
    question: 'What is resource allocation?',
    options: ['Buying project resources', 'Assigning available resources to project tasks', 'Counting project resources', 'Storing project resources'],
    correctAnswer: 1,
    explanation: 'Resource allocation is the process of assigning available resources to project tasks and activities.',
    points: 10
  },
  // Project Management Questions - Intermediate Level (15 questions)
  {
    id: 'pm_int_001',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is the difference between Agile and Waterfall methodologies?',
    options: ['No difference', 'Agile is iterative, Waterfall is sequential', 'Agile is faster', 'Waterfall is more flexible'],
    correctAnswer: 1,
    explanation: 'Agile uses iterative development cycles, while Waterfall follows a sequential approach.',
    points: 20
  },
  {
    id: 'pm_int_002',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is earned value management (EVM)?',
    options: ['Budget tracking method', 'Performance measurement technique', 'Risk assessment tool', 'Quality control process'],
    correctAnswer: 1,
    explanation: 'EVM is a performance measurement technique that integrates scope, schedule, and cost data.',
    points: 20
  },
  {
    id: 'pm_int_003',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is a RACI matrix?',
    options: ['Risk assessment tool', 'Responsibility assignment matrix', 'Resource allocation chart', 'Requirements analysis chart'],
    correctAnswer: 1,
    explanation: 'RACI matrix defines roles and responsibilities: Responsible, Accountable, Consulted, Informed.',
    points: 20
  },
  {
    id: 'pm_int_004',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is Monte Carlo simulation in project management?',
    options: ['Team building exercise', 'Risk analysis technique using probability', 'Budget estimation method', 'Schedule compression technique'],
    correctAnswer: 1,
    explanation: 'Monte Carlo simulation uses probability distributions to model and analyze project risks.',
    points: 20
  },
  {
    id: 'pm_int_005',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is fast tracking in project management?',
    options: ['Speeding up individual tasks', 'Performing activities in parallel', 'Reducing project scope', 'Adding more resources'],
    correctAnswer: 1,
    explanation: 'Fast tracking involves performing activities in parallel that were originally planned in sequence.',
    points: 20
  },
  {
    id: 'pm_int_006',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is crashing in project management?',
    options: ['Project failure', 'Adding resources to shorten schedule', 'Removing project features', 'Stopping the project'],
    correctAnswer: 1,
    explanation: 'Crashing involves adding resources to critical path activities to shorten the project schedule.',
    points: 20
  },
  {
    id: 'pm_int_007',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is a project management office (PMO)?',
    options: ['Project workspace', 'Centralized unit for project governance', 'Project meeting room', 'Project documentation center'],
    correctAnswer: 1,
    explanation: 'A PMO is a centralized organizational unit that oversees project management practices.',
    points: 20
  },
  {
    id: 'pm_int_008',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is the triple constraint in project management?',
    options: ['Time, Cost, Quality', 'Scope, Schedule, Budget', 'Resources, Risks, Requirements', 'Planning, Executing, Monitoring'],
    correctAnswer: 1,
    explanation: 'The triple constraint refers to scope, schedule (time), and budget (cost) - the three primary constraints.',
    points: 20
  },
  {
    id: 'pm_int_009',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is a sprint in Agile methodology?',
    options: ['Fast project completion', 'Time-boxed iteration', 'Emergency response', 'Quick meeting'],
    correctAnswer: 1,
    explanation: 'A sprint is a time-boxed iteration in Agile methodology, typically 1-4 weeks long.',
    points: 20
  },
  {
    id: 'pm_int_010',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is stakeholder analysis?',
    options: ['Counting stakeholders', 'Identifying and assessing stakeholder influence', 'Meeting with stakeholders', 'Reporting to stakeholders'],
    correctAnswer: 1,
    explanation: 'Stakeholder analysis involves identifying stakeholders and assessing their influence and interest.',
    points: 20
  },
  {
    id: 'pm_int_011',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is a risk register?',
    options: ['Risk counting tool', 'Document listing identified risks', 'Risk prevention method', 'Risk insurance policy'],
    correctAnswer: 1,
    explanation: 'A risk register is a document that lists identified risks, their probability, impact, and response strategies.',
    points: 20
  },
  {
    id: 'pm_int_012',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is change control?',
    options: ['Preventing all changes', 'Formal process for managing changes', 'Changing project managers', 'Controlling project costs'],
    correctAnswer: 1,
    explanation: 'Change control is a formal process for managing and documenting changes to project scope.',
    points: 20
  },
  {
    id: 'pm_int_013',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is float or slack time?',
    options: ['Break time for team', 'Amount of time an activity can be delayed', 'Project buffer time', 'Meeting duration'],
    correctAnswer: 1,
    explanation: 'Float or slack is the amount of time an activity can be delayed without affecting the project schedule.',
    points: 20
  },
  {
    id: 'pm_int_014',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is a project baseline?',
    options: ['Minimum project requirements', 'Approved version of project plan', 'Project starting point', 'Basic project information'],
    correctAnswer: 1,
    explanation: 'A project baseline is the approved version of the project plan used for comparison with actual performance.',
    points: 20
  },
  {
    id: 'pm_int_015',
    category: 'Project Management',
    difficulty: 'Intermediate',
    question: 'What is resource leveling?',
    options: ['Making all resources equal', 'Smoothing resource usage over time', 'Reducing resource costs', 'Training resources equally'],
    correctAnswer: 1,
    explanation: 'Resource leveling is a technique to smooth resource usage over time by adjusting start and finish dates.',
    points: 20
  },
  // Project Management Questions - Advanced Level (15 questions)
  {
    id: 'pm_adv_001',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is portfolio management?',
    options: ['Managing project documents', 'Centralized management of multiple projects', 'Financial investment management', 'Team performance management'],
    correctAnswer: 1,
    explanation: 'Portfolio management involves centralized management of multiple projects to achieve strategic objectives.',
    points: 30
  },
  {
    id: 'pm_adv_002',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is the Theory of Constraints (TOC) in project management?',
    options: ['Legal project limitations', 'Methodology focusing on system bottlenecks', 'Budget constraint theory', 'Time constraint analysis'],
    correctAnswer: 1,
    explanation: 'TOC is a methodology that focuses on identifying and managing the most critical bottleneck in a system.',
    points: 30
  },
  {
    id: 'pm_adv_003',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is Critical Chain Project Management (CCPM)?',
    options: ['Managing critical stakeholders', 'Resource-constrained project scheduling', 'Critical path analysis', 'Chain of command management'],
    correctAnswer: 1,
    explanation: 'CCPM is a method that focuses on resource constraints and uses buffers to protect the project schedule.',
    points: 30
  },
  {
    id: 'pm_adv_004',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is organizational project maturity?',
    options: ['Age of the organization', 'Level of project management capability', 'Number of completed projects', 'Size of project teams'],
    correctAnswer: 1,
    explanation: 'Organizational project maturity refers to the level of project management capability and sophistication.',
    points: 30
  },
  {
    id: 'pm_adv_005',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is value engineering in projects?',
    options: ['Engineering valuable products', 'Systematic method to improve project value', 'Calculating project worth', 'Engineering cost reduction'],
    correctAnswer: 1,
    explanation: 'Value engineering is a systematic method to improve the value of a project by analyzing its functions.',
    points: 30
  },
  {
    id: 'pm_adv_006',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is program management?',
    options: ['Software development management', 'Managing related projects as a group', 'TV program management', 'Training program management'],
    correctAnswer: 1,
    explanation: 'Program management involves managing a group of related projects to achieve strategic benefits.',
    points: 30
  },
  {
    id: 'pm_adv_007',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is benefits realization management?',
    options: ['Calculating project profits', 'Ensuring projects deliver intended benefits', 'Managing project rewards', 'Realizing project goals'],
    correctAnswer: 1,
    explanation: 'Benefits realization management ensures that projects deliver their intended business benefits.',
    points: 30
  },
  {
    id: 'pm_adv_008',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is organizational change management?',
    options: ['Changing organization structure', 'Managing people side of change', 'Organizational restructuring', 'Management team changes'],
    correctAnswer: 1,
    explanation: 'Organizational change management focuses on the people side of change to achieve business results.',
    points: 30
  },
  {
    id: 'pm_adv_009',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is enterprise project management?',
    options: ['Large project management', 'Organization-wide project management approach', 'Enterprise software projects', 'Multi-company projects'],
    correctAnswer: 1,
    explanation: 'Enterprise project management is an organization-wide approach to managing projects strategically.',
    points: 30
  },
  {
    id: 'pm_adv_010',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is project governance?',
    options: ['Government projects', 'Framework for project decision-making', 'Project legal compliance', 'Project leadership structure'],
    correctAnswer: 1,
    explanation: 'Project governance provides the framework for making project decisions and ensuring accountability.',
    points: 30
  },
  {
    id: 'pm_adv_011',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is strategic project management?',
    options: ['Military project management', 'Aligning projects with business strategy', 'Long-term project planning', 'High-level project oversight'],
    correctAnswer: 1,
    explanation: 'Strategic project management focuses on aligning projects with organizational strategy and objectives.',
    points: 30
  },
  {
    id: 'pm_adv_012',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is project complexity management?',
    options: ['Making projects complex', 'Managing complicated project elements', 'Simplifying project processes', 'Complex mathematical calculations'],
    correctAnswer: 1,
    explanation: 'Project complexity management involves understanding and managing the various complex elements in projects.',
    points: 30
  },
  {
    id: 'pm_adv_013',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is virtual team management?',
    options: ['Managing computer simulations', 'Leading geographically dispersed teams', 'Managing online projects', 'Virtual reality project management'],
    correctAnswer: 1,
    explanation: 'Virtual team management involves leading and coordinating geographically dispersed team members.',
    points: 30
  },
  {
    id: 'pm_adv_014',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is project knowledge management?',
    options: ['Learning about projects', 'Capturing and sharing project knowledge', 'Project education programs', 'Knowledge worker management'],
    correctAnswer: 1,
    explanation: 'Project knowledge management involves capturing, sharing, and leveraging knowledge across projects.',
    points: 30
  },
  {
    id: 'pm_adv_015',
    category: 'Project Management',
    difficulty: 'Advanced',
    question: 'What is agile portfolio management?',
    options: ['Fast portfolio creation', 'Applying agile principles to portfolio management', 'Agile investment strategies', 'Quick portfolio decisions'],
    correctAnswer: 1,
    explanation: 'Agile portfolio management applies agile principles and practices to managing project portfolios.',
    points: 30
  },

  // Design Questions - Beginner Level (15 questions)
  {
    id: 'dg_beg_001',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What does UX stand for?',
    options: ['User Experience', 'User Extension', 'Universal Experience', 'User Execution'],
    correctAnswer: 0,
    explanation: 'UX stands for User Experience, focusing on how users interact with and experience a product.',
    points: 10
  },
  {
    id: 'dg_beg_002',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What does UI stand for?',
    options: ['User Interface', 'Universal Integration', 'User Integration', 'Universal Interface'],
    correctAnswer: 0,
    explanation: 'UI stands for User Interface, the visual elements users interact with.',
    points: 10
  },
  {
    id: 'dg_beg_003',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is a wireframe?',
    options: ['A type of font', 'A basic structural blueprint of a webpage', 'A color scheme', 'A programming language'],
    correctAnswer: 1,
    explanation: 'A wireframe is a basic structural blueprint showing the layout and functionality of a webpage or app.',
    points: 10
  },
  {
    id: 'dg_beg_004',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is a prototype?',
    options: ['Final product', 'Early model of a product', 'Color palette', 'Typography guide'],
    correctAnswer: 1,
    explanation: 'A prototype is an early model or sample of a product built to test concepts and processes.',
    points: 10
  },
  {
    id: 'dg_beg_005',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is typography?',
    options: ['Image editing', 'Art and technique of arranging type', 'Color theory', 'Layout design'],
    correctAnswer: 1,
    explanation: 'Typography is the art and technique of arranging type to make written language legible and appealing.',
    points: 10
  },
  {
    id: 'dg_beg_006',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is white space in design?',
    options: ['Empty areas in a design', 'White colored elements', 'Background color', 'Text spacing only'],
    correctAnswer: 0,
    explanation: 'White space (or negative space) refers to empty areas in a design that help create balance and focus.',
    points: 10
  },
  {
    id: 'dg_beg_007',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is a color palette?',
    options: ['Painting tool', 'Range of colors used in design', 'Color mixing technique', 'Digital art software'],
    correctAnswer: 1,
    explanation: 'A color palette is a range of colors chosen for use in a design project.',
    points: 10
  },
  {
    id: 'dg_beg_008',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is contrast in design?',
    options: ['Similarity between elements', 'Difference between design elements', 'Color brightness', 'Font size'],
    correctAnswer: 1,
    explanation: 'Contrast is the difference between design elements, used to create visual interest and hierarchy.',
    points: 10
  },
  {
    id: 'dg_beg_009',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is alignment in design?',
    options: ['Color matching', 'Positioning elements in relation to each other', 'Font selection', 'Image editing'],
    correctAnswer: 1,
    explanation: 'Alignment refers to positioning elements in relation to each other and the overall design.',
    points: 10
  },
  {
    id: 'dg_beg_010',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is hierarchy in design?',
    options: ['Management structure', 'Visual arrangement showing importance', 'Color organization', 'File organization'],
    correctAnswer: 1,
    explanation: 'Hierarchy is the visual arrangement of elements to show their order of importance.',
    points: 10
  },
  {
    id: 'dg_beg_011',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is a grid system?',
    options: ['Electrical system', 'Framework for organizing content', 'Image filter', 'Color system'],
    correctAnswer: 1,
    explanation: 'A grid system is a framework used to organize and align content in a design.',
    points: 10
  },
  {
    id: 'dg_beg_012',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is responsive design?',
    options: ['Fast loading design', 'Design that adapts to different screen sizes', 'Interactive design', 'Animated design'],
    correctAnswer: 1,
    explanation: 'Responsive design adapts and responds to different screen sizes and devices.',
    points: 10
  },
  {
    id: 'dg_beg_013',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is a mood board?',
    options: ['Emotional design', 'Collection of visual inspiration', 'Color wheel', 'Design software'],
    correctAnswer: 1,
    explanation: 'A mood board is a collection of visual materials used to convey the intended style or concept.',
    points: 10
  },
  {
    id: 'dg_beg_014',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is branding?',
    options: ['Logo design only', 'Complete identity of a company', 'Marketing strategy', 'Website design'],
    correctAnswer: 1,
    explanation: 'Branding encompasses the complete identity and perception of a company or product.',
    points: 10
  },
  {
    id: 'dg_beg_015',
    category: 'Design',
    difficulty: 'Beginner',
    question: 'What is accessibility in design?',
    options: ['Easy to find', 'Design usable by people with disabilities', 'Simple design', 'Fast loading'],
    correctAnswer: 1,
    explanation: 'Accessibility ensures design is usable by people with various abilities and disabilities.',
    points: 10
  },
  // Design Questions - Intermediate Level (15 questions)
  {
    id: 'dg_int_001',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is the golden ratio in design?',
    options: ['1:1 ratio', '1:1.618 ratio', '2:3 ratio', '3:4 ratio'],
    correctAnswer: 1,
    explanation: 'The golden ratio (1:1.618) is considered aesthetically pleasing and is often used in design composition.',
    points: 20
  },
  {
    id: 'dg_int_002',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is the difference between RGB and CMYK?',
    options: ['No difference', 'RGB for screens, CMYK for print', 'RGB is older', 'CMYK has more colors'],
    correctAnswer: 1,
    explanation: 'RGB (Red, Green, Blue) is used for digital screens, while CMYK (Cyan, Magenta, Yellow, Black) is used for printing.',
    points: 20
  },
  {
    id: 'dg_int_003',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is kerning?',
    options: ['Line spacing', 'Space between individual characters', 'Font weight', 'Text alignment'],
    correctAnswer: 1,
    explanation: 'Kerning is the adjustment of space between individual characters in typography.',
    points: 20
  },
  {
    id: 'dg_int_004',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is the rule of thirds?',
    options: ['Using three colors', 'Dividing design into nine equal parts', 'Three-column layout', 'Three-step process'],
    correctAnswer: 1,
    explanation: 'The rule of thirds divides an image into nine equal parts to create more interesting compositions.',
    points: 20
  },
  {
    id: 'dg_int_005',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is a design system?',
    options: ['Design software', 'Collection of reusable components and guidelines', 'Design process', 'Design team structure'],
    correctAnswer: 1,
    explanation: 'A design system is a collection of reusable components, patterns, and guidelines for consistent design.',
    points: 20
  },
  {
    id: 'dg_int_006',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is user persona?',
    options: ['User profile picture', 'Fictional character representing user group', 'User feedback', 'User interface element'],
    correctAnswer: 1,
    explanation: 'A user persona is a fictional character created to represent a user type that might use a product.',
    points: 20
  },
  {
    id: 'dg_int_007',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is A/B testing in design?',
    options: ['Testing two design versions', 'Alphabetical testing', 'Testing with two users', 'Testing twice'],
    correctAnswer: 0,
    explanation: 'A/B testing compares two versions of a design to determine which performs better.',
    points: 20
  },
  {
    id: 'dg_int_008',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is information architecture?',
    options: ['Building design', 'Organization and structure of content', 'Data storage', 'Network architecture'],
    correctAnswer: 1,
    explanation: 'Information architecture is the organization and structure of content in a way that users can navigate effectively.',
    points: 20
  },
  {
    id: 'dg_int_009',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is usability testing?',
    options: ['Testing software bugs', 'Testing how easy a product is to use', 'Testing loading speed', 'Testing visual appeal'],
    correctAnswer: 1,
    explanation: 'Usability testing evaluates how easy and intuitive a product is for users to navigate and use.',
    points: 20
  },
  {
    id: 'dg_int_010',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is progressive disclosure?',
    options: ['Gradual color changes', 'Revealing information progressively', 'Progressive web apps', 'Disclosure statements'],
    correctAnswer: 1,
    explanation: 'Progressive disclosure is a technique that presents information in layers, revealing details as needed.',
    points: 20
  },
  {
    id: 'dg_int_011',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is card sorting?',
    options: ['Organizing playing cards', 'UX research method for organizing information', 'Design layout technique', 'File organization method'],
    correctAnswer: 1,
    explanation: 'Card sorting is a UX research method used to understand how users categorize and organize information.',
    points: 20
  },
  {
    id: 'dg_int_012',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is the difference between serif and sans-serif fonts?',
    options: ['Color difference', 'Serif has decorative strokes, sans-serif does not', 'Size difference', 'Weight difference'],
    correctAnswer: 1,
    explanation: 'Serif fonts have decorative strokes (serifs) at the end of letterforms, while sans-serif fonts do not.',
    points: 20
  },
  {
    id: 'dg_int_013',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is gestalt principles in design?',
    options: ['German design style', 'Principles of how humans perceive visual elements', 'Color theory', 'Typography rules'],
    correctAnswer: 1,
    explanation: 'Gestalt principles describe how humans naturally organize visual elements into groups or unified wholes.',
    points: 20
  },
  {
    id: 'dg_int_014',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is design thinking?',
    options: ['Thinking about design', 'Human-centered approach to innovation', 'Design philosophy', 'Creative thinking'],
    correctAnswer: 1,
    explanation: 'Design thinking is a human-centered approach to innovation that integrates needs, technology, and business requirements.',
    points: 20
  },
  {
    id: 'dg_int_015',
    category: 'Design',
    difficulty: 'Intermediate',
    question: 'What is mobile-first design?',
    options: ['Designing for mobile phones only', 'Starting design process with mobile devices', 'Mobile app design', 'Responsive design'],
    correctAnswer: 1,
    explanation: 'Mobile-first design starts the design process with mobile devices and then scales up to larger screens.',
    points: 20
  },
  // Design Questions - Advanced Level (15 questions)
  {
    id: 'dg_adv_001',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is atomic design methodology?',
    options: ['Nuclear design', 'Methodology for creating design systems', 'Molecular design', 'Chemical design process'],
    correctAnswer: 1,
    explanation: 'Atomic design is a methodology for creating design systems with five distinct levels: atoms, molecules, organisms, templates, and pages.',
    points: 30
  },
  {
    id: 'dg_adv_002',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is design ops?',
    options: ['Design operations and processes', 'Design software', 'Design team management', 'Design methodology'],
    correctAnswer: 0,
    explanation: 'Design ops focuses on optimizing design operations, processes, and team efficiency.',
    points: 30
  },
  {
    id: 'dg_adv_003',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is service design?',
    options: ['Designing services only', 'Holistic approach to designing entire service experiences', 'Customer service design', 'Web service design'],
    correctAnswer: 1,
    explanation: 'Service design is a holistic approach that considers all touchpoints and interactions in a service experience.',
    points: 30
  },
  {
    id: 'dg_adv_004',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is inclusive design?',
    options: ['Including everyone in design process', 'Design methodology that considers diverse user needs', 'Comprehensive design', 'All-inclusive design package'],
    correctAnswer: 1,
    explanation: 'Inclusive design is a methodology that considers the full range of human diversity in design decisions.',
    points: 30
  },
  {
    id: 'dg_adv_005',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is behavioral design?',
    options: ['Designing behavior', 'Using psychology to influence user behavior', 'Animal behavior design', 'Behavioral analysis'],
    correctAnswer: 1,
    explanation: 'Behavioral design uses insights from psychology and behavioral economics to influence user behavior.',
    points: 30
  },
  {
    id: 'dg_adv_006',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is design research?',
    options: ['Researching designs', 'Systematic investigation to inform design decisions', 'Academic design study', 'Design history research'],
    correctAnswer: 1,
    explanation: 'Design research is systematic investigation and analysis to inform and validate design decisions.',
    points: 30
  },
  {
    id: 'dg_adv_007',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is design strategy?',
    options: ['Planning design projects', 'Aligning design with business objectives', 'Design methodology', 'Strategic planning for designers'],
    correctAnswer: 1,
    explanation: 'Design strategy aligns design decisions with business objectives and user needs to create value.',
    points: 30
  },
  {
    id: 'dg_adv_008',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is systems thinking in design?',
    options: ['Designing systems', 'Holistic approach considering interconnections', 'Computer systems design', 'Systematic design process'],
    correctAnswer: 1,
    explanation: 'Systems thinking considers the holistic view and interconnections between different parts of a system.',
    points: 30
  },
  {
    id: 'dg_adv_009',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is design maturity?',
    options: ['Age of design', 'Level of design sophistication in organization', 'Mature design style', 'Design experience level'],
    correctAnswer: 1,
    explanation: 'Design maturity refers to the level of design sophistication and integration within an organization.',
    points: 30
  },
  {
    id: 'dg_adv_010',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is speculative design?',
    options: ['Guessing design solutions', 'Design that explores possible futures', 'Theoretical design', 'Experimental design'],
    correctAnswer: 1,
    explanation: 'Speculative design explores possible futures and alternative scenarios through design proposals.',
    points: 30
  },
  {
    id: 'dg_adv_011',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is co-design?',
    options: ['Designing together', 'Collaborative design process with stakeholders', 'Copying designs', 'Coordinated design'],
    correctAnswer: 1,
    explanation: 'Co-design is a collaborative approach that actively involves stakeholders in the design process.',
    points: 30
  },
  {
    id: 'dg_adv_012',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is design ethics?',
    options: ['Ethical behavior for designers', 'Moral considerations in design decisions', 'Design code of conduct', 'Professional ethics'],
    correctAnswer: 1,
    explanation: 'Design ethics involves considering the moral implications and responsibilities of design decisions.',
    points: 30
  },
  {
    id: 'dg_adv_013',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is design leadership?',
    options: ['Leading design teams', 'Strategic influence of design in organizations', 'Design management', 'Creative direction'],
    correctAnswer: 1,
    explanation: 'Design leadership involves the strategic influence and integration of design thinking throughout an organization.',
    points: 30
  },
  {
    id: 'dg_adv_014',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is design for sustainability?',
    options: ['Long-lasting design', 'Design considering environmental and social impact', 'Sustainable materials only', 'Green design'],
    correctAnswer: 1,
    explanation: 'Design for sustainability considers the environmental, social, and economic impact of design decisions.',
    points: 30
  },
  {
    id: 'dg_adv_015',
    category: 'Design',
    difficulty: 'Advanced',
    question: 'What is design transformation?',
    options: ['Changing designs', 'Organizational change through design', 'Design evolution', 'Transforming design processes'],
    correctAnswer: 1,
    explanation: 'Design transformation involves using design thinking and practices to drive organizational change and innovation.',
    points: 30
  },

  // Sales Questions - Beginner Level (15 questions)
  {
    id: 'sl_beg_001',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What does CRM stand for?',
    options: ['Customer Relationship Management', 'Customer Revenue Management', 'Client Resource Management', 'Customer Retention Method'],
    correctAnswer: 0,
    explanation: 'CRM stands for Customer Relationship Management, a system for managing customer interactions and data.',
    points: 10
  },
  {
    id: 'sl_beg_002',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is a sales funnel?',
    options: ['A physical funnel for sales', 'The process prospects go through to become customers', 'A sales tool', 'A marketing strategy'],
    correctAnswer: 1,
    explanation: 'A sales funnel represents the journey prospects take from awareness to purchase.',
    points: 10
  },
  {
    id: 'sl_beg_003',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is a lead?',
    options: ['A metal element', 'A potential customer who has shown interest', 'A sales manager', 'A product feature'],
    correctAnswer: 1,
    explanation: 'A lead is a potential customer who has expressed interest in your product or service.',
    points: 10
  },
  {
    id: 'sl_beg_004',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is a prospect?',
    options: ['A sales forecast', 'A potential customer who fits your target market', 'A sales technique', 'A product demonstration'],
    correctAnswer: 1,
    explanation: 'A prospect is a potential customer who fits your ideal customer profile.',
    points: 10
  },
  {
    id: 'sl_beg_005',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is cold calling?',
    options: ['Calling in winter', 'Contacting prospects without prior relationship', 'Calling angry customers', 'Making calls from a cold room'],
    correctAnswer: 1,
    explanation: 'Cold calling is reaching out to prospects who have had no prior contact with your company.',
    points: 10
  },
  {
    id: 'sl_beg_006',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is a sales quota?',
    options: ['Sales team size', 'Target amount of sales to achieve', 'Sales commission rate', 'Number of calls to make'],
    correctAnswer: 1,
    explanation: 'A sales quota is a target amount of sales revenue or units a salesperson is expected to achieve.',
    points: 10
  },
  {
    id: 'sl_beg_007',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is upselling?',
    options: ['Selling products upstairs', 'Encouraging customers to buy more expensive versions', 'Selling to upper management', 'Increasing sales volume'],
    correctAnswer: 1,
    explanation: 'Upselling is encouraging customers to purchase a more expensive version of a product.',
    points: 10
  },
  {
    id: 'sl_beg_008',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is cross-selling?',
    options: ['Selling across borders', 'Selling complementary products', 'Selling to competitors', 'Selling angrily'],
    correctAnswer: 1,
    explanation: 'Cross-selling is offering complementary or related products to existing customers.',
    points: 10
  },
  {
    id: 'sl_beg_009',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is a sales pitch?',
    options: ['Baseball field for sales', 'Presentation to persuade prospects to buy', 'Sales team meeting', 'Product pricing strategy'],
    correctAnswer: 1,
    explanation: 'A sales pitch is a presentation designed to persuade prospects to purchase your product or service.',
    points: 10
  },
  {
    id: 'sl_beg_010',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is closing a sale?',
    options: ['Ending the sales day', 'Finalizing the purchase decision', 'Closing the store', 'Stopping sales activities'],
    correctAnswer: 1,
    explanation: 'Closing a sale means successfully finalizing the purchase decision with a customer.',
    points: 10
  },
  {
    id: 'sl_beg_011',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is a sales objection?',
    options: ['Sales goal', 'Customer concern or hesitation', 'Sales strategy', 'Product feature'],
    correctAnswer: 1,
    explanation: 'A sales objection is a concern or hesitation expressed by a prospect during the sales process.',
    points: 10
  },
  {
    id: 'sl_beg_012',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is a sales pipeline?',
    options: ['Physical pipe for sales', 'Visual representation of sales process stages', 'Sales team structure', 'Product delivery system'],
    correctAnswer: 1,
    explanation: 'A sales pipeline is a visual representation of prospects at different stages of the sales process.',
    points: 10
  },
  {
    id: 'sl_beg_013',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is B2B sales?',
    options: ['Business to Business sales', 'Back to Back sales', 'Buy to Buy sales', 'Best to Best sales'],
    correctAnswer: 0,
    explanation: 'B2B sales refers to Business to Business sales, selling products or services to other businesses.',
    points: 10
  },
  {
    id: 'sl_beg_014',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is B2C sales?',
    options: ['Business to Customer sales', 'Back to Customer sales', 'Buy to Customer sales', 'Best to Customer sales'],
    correctAnswer: 0,
    explanation: 'B2C sales refers to Business to Customer sales, selling directly to individual consumers.',
    points: 10
  },
  {
    id: 'sl_beg_015',
    category: 'Sales',
    difficulty: 'Beginner',
    question: 'What is a sales commission?',
    options: ['Sales team committee', 'Payment based on sales performance', 'Sales permission', 'Sales assignment'],
    correctAnswer: 1,
    explanation: 'A sales commission is additional payment based on the amount or value of sales achieved.',
    points: 10
  },
  // Sales Questions - Intermediate Level (15 questions)
  {
    id: 'sl_int_001',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is SPIN selling?',
    options: ['Spinning products', 'Situation, Problem, Implication, Need-payoff questioning', 'Speed selling technique', 'Spiral sales approach'],
    correctAnswer: 1,
    explanation: 'SPIN selling is a questioning technique: Situation, Problem, Implication, Need-payoff questions.',
    points: 20
  },
  {
    id: 'sl_int_002',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is solution selling?',
    options: ['Solving customer problems with tailored solutions', 'Selling solutions software', 'Quick problem solving', 'Mathematical solutions'],
    correctAnswer: 0,
    explanation: 'Solution selling focuses on understanding customer problems and providing tailored solutions.',
    points: 20
  },
  {
    id: 'sl_int_003',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is consultative selling?',
    options: ['Selling consulting services', 'Acting as advisor to understand customer needs', 'Consulting with team before selling', 'Selling consultation time'],
    correctAnswer: 1,
    explanation: 'Consultative selling involves acting as an advisor to understand and address customer needs.',
    points: 20
  },
  {
    id: 'sl_int_004',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is a sales qualified lead (SQL)?',
    options: ['Any interested prospect', 'Lead vetted and ready for sales team', 'Lead with SQL database skills', 'Qualified sales person'],
    correctAnswer: 1,
    explanation: 'An SQL is a lead that has been vetted and determined ready for direct sales follow-up.',
    points: 20
  },
  {
    id: 'sl_int_005',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is customer lifetime value (CLV)?',
    options: ['Customer age', 'Total revenue from customer over relationship', 'Customer satisfaction score', 'Time customer stays with company'],
    correctAnswer: 1,
    explanation: 'CLV is the total revenue a business can expect from a customer throughout their relationship.',
    points: 20
  },
  {
    id: 'sl_int_006',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is churn rate?',
    options: ['Rate of butter making', 'Rate at which customers stop buying', 'Rate of sales increase', 'Rate of product returns'],
    correctAnswer: 1,
    explanation: 'Churn rate is the percentage of customers who stop buying from a company over a given period.',
    points: 20
  },
  {
    id: 'sl_int_007',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is account-based selling?',
    options: ['Selling accounting software', 'Targeting specific high-value accounts', 'Selling based on bank accounts', 'Account management selling'],
    correctAnswer: 1,
    explanation: 'Account-based selling focuses on targeting and customizing approach for specific high-value accounts.',
    points: 20
  },
  {
    id: 'sl_int_008',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is social selling?',
    options: ['Selling at social events', 'Using social media for sales activities', 'Selling social media services', 'Group selling approach'],
    correctAnswer: 1,
    explanation: 'Social selling uses social media platforms to find, connect with, and nurture sales prospects.',
    points: 20
  },
  {
    id: 'sl_int_009',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is a sales cadence?',
    options: ['Sales rhythm', 'Sequence of sales touchpoints', 'Sales team pace', 'Sales music'],
    correctAnswer: 1,
    explanation: 'A sales cadence is a sequence of touchpoints designed to connect with prospects over time.',
    points: 20
  },
  {
    id: 'sl_int_010',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is sales enablement?',
    options: ['Enabling sales features', 'Providing tools and content to help sales teams', 'Sales team empowerment', 'Sales software activation'],
    correctAnswer: 1,
    explanation: 'Sales enablement provides sales teams with tools, content, and training to sell more effectively.',
    points: 20
  },
  {
    id: 'sl_int_011',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is a discovery call?',
    options: ['Finding new customers', 'Call to understand prospect needs', 'Discovering product features', 'Call to discover problems'],
    correctAnswer: 1,
    explanation: 'A discovery call is designed to understand prospect needs, challenges, and decision-making process.',
    points: 20
  },
  {
    id: 'sl_int_012',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is value-based selling?',
    options: ['Selling valuable items', 'Focusing on value delivered to customer', 'Selling based on company values', 'Pricing based on value'],
    correctAnswer: 1,
    explanation: 'Value-based selling focuses on the value and benefits delivered to the customer rather than features.',
    points: 20
  },
  {
    id: 'sl_int_013',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is a champion in sales?',
    options: ['Best salesperson', 'Internal advocate who supports your solution', 'Sales winner', 'Competition winner'],
    correctAnswer: 1,
    explanation: 'A champion is someone within the prospect organization who advocates for your solution.',
    points: 20
  },
  {
    id: 'sl_int_014',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is sales forecasting?',
    options: ['Weather prediction for sales', 'Predicting future sales performance', 'Sales team planning', 'Sales goal setting'],
    correctAnswer: 1,
    explanation: 'Sales forecasting is predicting future sales performance based on historical data and trends.',
    points: 20
  },
  {
    id: 'sl_int_015',
    category: 'Sales',
    difficulty: 'Intermediate',
    question: 'What is a buying signal?',
    options: ['Signal to buy stocks', 'Indication that prospect is ready to purchase', 'Buy button signal', 'Purchase notification'],
    correctAnswer: 1,
    explanation: 'A buying signal is verbal or non-verbal indication that a prospect is ready to make a purchase.',
    points: 20
  },
  // Sales Questions - Advanced Level (15 questions)
  {
    id: 'sl_adv_001',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is the Challenger Sale methodology?',
    options: ['Challenging customers', 'Teaching, tailoring, and taking control approach', 'Competitive selling', 'Difficult sales approach'],
    correctAnswer: 1,
    explanation: 'The Challenger Sale methodology involves teaching customers, tailoring the message, and taking control of the sale.',
    points: 30
  },
  {
    id: 'sl_adv_002',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is revenue operations (RevOps)?',
    options: ['Revenue calculations', 'Alignment of sales, marketing, and customer success', 'Revenue reporting', 'Operations revenue'],
    correctAnswer: 1,
    explanation: 'RevOps aligns sales, marketing, and customer success operations to drive revenue growth.',
    points: 30
  },
  {
    id: 'sl_adv_003',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is predictive sales analytics?',
    options: ['Predicting sales outcomes', 'Using data to forecast sales behavior and outcomes', 'Sales prediction games', 'Analytical sales reports'],
    correctAnswer: 1,
    explanation: 'Predictive sales analytics uses data and algorithms to forecast sales behavior and outcomes.',
    points: 30
  },
  {
    id: 'sl_adv_004',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is sales attribution modeling?',
    options: ['Attributing sales to salespeople', 'Determining which touchpoints contribute to sales', 'Sales team attribution', 'Product attribution'],
    correctAnswer: 1,
    explanation: 'Sales attribution modeling determines which marketing and sales touchpoints contribute to conversions.',
    points: 30
  },
  {
    id: 'sl_adv_005',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is complex sales cycle management?',
    options: ['Managing complicated sales', 'Strategies for long, multi-stakeholder sales processes', 'Complex product sales', 'Difficult customer management'],
    correctAnswer: 1,
    explanation: 'Complex sales cycle management involves strategies for long, multi-stakeholder B2B sales processes.',
    points: 30
  },
  {
    id: 'sl_adv_006',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is sales process optimization?',
    options: ['Optimizing sales team', 'Systematically improving sales process efficiency', 'Sales software optimization', 'Optimal sales timing'],
    correctAnswer: 1,
    explanation: 'Sales process optimization involves systematically analyzing and improving sales process efficiency.',
    points: 30
  },
  {
    id: 'sl_adv_007',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is enterprise sales?',
    options: ['Selling enterprises', 'Complex B2B sales to large organizations', 'Business enterprise software', 'Enterprise-level pricing'],
    correctAnswer: 1,
    explanation: 'Enterprise sales involves complex, high-value B2B sales to large organizations with long sales cycles.',
    points: 30
  },
  {
    id: 'sl_adv_008',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is sales territory optimization?',
    options: ['Optimizing sales regions', 'Strategic allocation of accounts and resources', 'Territory mapping', 'Geographic optimization'],
    correctAnswer: 1,
    explanation: 'Sales territory optimization involves strategic allocation of accounts and resources to maximize revenue.',
    points: 30
  },
  {
    id: 'sl_adv_009',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is sales compensation modeling?',
    options: ['Modeling sales compensation', 'Designing incentive structures to drive behavior', 'Compensation calculations', 'Sales salary modeling'],
    correctAnswer: 1,
    explanation: 'Sales compensation modeling involves designing incentive structures to drive desired sales behaviors.',
    points: 30
  },
  {
    id: 'sl_adv_010',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is customer success selling?',
    options: ['Selling success stories', 'Focusing on customer outcomes and success', 'Successful customer sales', 'Customer service selling'],
    correctAnswer: 1,
    explanation: 'Customer success selling focuses on ensuring customers achieve their desired outcomes with your solution.',
    points: 30
  },
  {
    id: 'sl_adv_011',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is sales AI and automation?',
    options: ['Artificial sales intelligence', 'Using AI to enhance sales processes', 'Automated sales robots', 'AI sales software'],
    correctAnswer: 1,
    explanation: 'Sales AI and automation use artificial intelligence to enhance sales processes and decision-making.',
    points: 30
  },
  {
    id: 'sl_adv_012',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is omnichannel sales strategy?',
    options: ['All-channel sales', 'Integrated approach across all customer touchpoints', 'Multiple sales channels', 'Channel sales strategy'],
    correctAnswer: 1,
    explanation: 'Omnichannel sales strategy provides integrated customer experience across all touchpoints and channels.',
    points: 30
  },
  {
    id: 'sl_adv_013',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is sales performance management?',
    options: ['Managing sales performance', 'Systematic approach to optimize sales team performance', 'Performance reviews for sales', 'Sales metrics management'],
    correctAnswer: 1,
    explanation: 'Sales performance management is a systematic approach to optimize sales team performance and results.',
    points: 30
  },
  {
    id: 'sl_adv_014',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is digital sales transformation?',
    options: ['Transforming to digital sales', 'Integrating digital technologies into sales processes', 'Digital sales tools', 'Online sales transformation'],
    correctAnswer: 1,
    explanation: 'Digital sales transformation involves integrating digital technologies and data into sales processes.',
    points: 30
  },
  {
    id: 'sl_adv_015',
    category: 'Sales',
    difficulty: 'Advanced',
    question: 'What is strategic account management?',
    options: ['Managing strategic accounts', 'Long-term relationship management with key accounts', 'Account strategy planning', 'Strategic sales accounts'],
    correctAnswer: 1,
    explanation: 'Strategic account management focuses on long-term relationship building and value creation with key accounts.',
    points: 30
  },

  // Human Resources Questions - Beginner Level (15 questions)
  {
    id: 'hr_beg_001',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What does HR stand for?',
    options: ['Human Relations', 'Human Resources', 'Human Rights', 'Human Requirements'],
    correctAnswer: 1,
    explanation: 'HR stands for Human Resources, the department that manages employee-related functions.',
    points: 10
  },
  {
    id: 'hr_beg_002',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is recruitment?',
    options: ['Employee training', 'Process of finding and hiring employees', 'Employee evaluation', 'Salary negotiation'],
    correctAnswer: 1,
    explanation: 'Recruitment is the process of finding, attracting, and hiring qualified candidates for job positions.',
    points: 10
  },
  {
    id: 'hr_beg_003',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is onboarding?',
    options: ['Getting on a ship', 'Process of integrating new employees', 'Board meeting', 'Employee termination'],
    correctAnswer: 1,
    explanation: 'Onboarding is the process of integrating new employees into the organization and their roles.',
    points: 10
  },
  {
    id: 'hr_beg_004',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is a job description?',
    options: ['Employee biography', 'Document outlining job duties and requirements', 'Company description', 'Performance review'],
    correctAnswer: 1,
    explanation: 'A job description is a document that outlines the duties, responsibilities, and requirements of a job position.',
    points: 10
  },
  {
    id: 'hr_beg_005',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is employee orientation?',
    options: ['Employee direction', 'Introduction to company and job', 'Employee location', 'Employee attitude'],
    correctAnswer: 1,
    explanation: 'Employee orientation is the introduction process for new employees to learn about the company and their role.',
    points: 10
  },
  {
    id: 'hr_beg_006',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is a performance review?',
    options: ['Movie review', 'Evaluation of employee performance', 'Product review', 'Company review'],
    correctAnswer: 1,
    explanation: 'A performance review is a formal evaluation of an employee\'s job performance and productivity.',
    points: 10
  },
  {
    id: 'hr_beg_007',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is employee training?',
    options: ['Physical exercise', 'Process of developing employee skills', 'Employee transportation', 'Employee tracking'],
    correctAnswer: 1,
    explanation: 'Employee training is the process of developing skills and knowledge to improve job performance.',
    points: 10
  },
  {
    id: 'hr_beg_008',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is payroll?',
    options: ['Employee list', 'Process of paying employee wages', 'Payment roll', 'Employee roles'],
    correctAnswer: 1,
    explanation: 'Payroll is the process of calculating and distributing employee wages and salaries.',
    points: 10
  },
  {
    id: 'hr_beg_009',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What are employee benefits?',
    options: ['Employee advantages', 'Additional compensation beyond salary', 'Employee profits', 'Employee bonuses only'],
    correctAnswer: 1,
    explanation: 'Employee benefits are additional forms of compensation provided beyond regular salary or wages.',
    points: 10
  },
  {
    id: 'hr_beg_010',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is workplace diversity?',
    options: ['Different work locations', 'Variety of employee backgrounds and characteristics', 'Various job types', 'Different work schedules'],
    correctAnswer: 1,
    explanation: 'Workplace diversity refers to the variety of differences among employees in terms of background, characteristics, and perspectives.',
    points: 10
  },
  {
    id: 'hr_beg_011',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is employee retention?',
    options: ['Keeping employees in the company', 'Employee memory', 'Employee storage', 'Employee detention'],
    correctAnswer: 0,
    explanation: 'Employee retention refers to strategies and practices aimed at keeping valuable employees in the organization.',
    points: 10
  },
  {
    id: 'hr_beg_012',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is a resume?',
    options: ['To continue', 'Document summarizing qualifications and experience', 'Employee summary', 'Job application'],
    correctAnswer: 1,
    explanation: 'A resume is a document that summarizes a person\'s education, work experience, and qualifications.',
    points: 10
  },
  {
    id: 'hr_beg_013',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is workplace harassment?',
    options: ['Workplace stress', 'Unwelcome conduct that creates hostile environment', 'Workplace competition', 'Workplace pressure'],
    correctAnswer: 1,
    explanation: 'Workplace harassment is unwelcome conduct that creates an intimidating or hostile work environment.',
    points: 10
  },
  {
    id: 'hr_beg_014',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What is an employee handbook?',
    options: ['Employee manual', 'Guide containing company policies and procedures', 'Employee book', 'Training material'],
    correctAnswer: 1,
    explanation: 'An employee handbook is a guide that contains company policies, procedures, and expectations.',
    points: 10
  },
  {
    id: 'hr_beg_015',
    category: 'Human Resources',
    difficulty: 'Beginner',
    question: 'What does KPI stand for in performance management?',
    options: ['Key Performance Indicator', 'Knowledge Performance Index', 'Key Process Improvement', 'Knowledge Process Integration'],
    correctAnswer: 0,
    explanation: 'KPI stands for Key Performance Indicator, metrics used to evaluate success in meeting objectives.',
    points: 10
  },
  // Human Resources Questions - Intermediate Level (15 questions)
  {
    id: 'hr_int_001',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is talent acquisition?',
    options: ['Buying talent', 'Strategic approach to finding and hiring talent', 'Talent show', 'Talent development'],
    correctAnswer: 1,
    explanation: 'Talent acquisition is a strategic approach to identifying, attracting, and hiring skilled workers.',
    points: 20
  },
  {
    id: 'hr_int_002',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is employee engagement?',
    options: ['Employee marriage', 'Level of employee commitment and involvement', 'Employee appointment', 'Employee agreement'],
    correctAnswer: 1,
    explanation: 'Employee engagement is the level of commitment, passion, and loyalty employees have toward their work and company.',
    points: 20
  },
  {
    id: 'hr_int_003',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is succession planning?',
    options: ['Planning success', 'Preparing for key position transitions', 'Sequential planning', 'Success measurement'],
    correctAnswer: 1,
    explanation: 'Succession planning is the process of preparing for transitions in key positions within an organization.',
    points: 20
  },
  {
    id: 'hr_int_004',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is competency-based hiring?',
    options: ['Hiring based on competition', 'Hiring based on specific skills and abilities', 'Hiring competent people', 'Hiring based on competency tests'],
    correctAnswer: 1,
    explanation: 'Competency-based hiring focuses on specific skills, knowledge, and abilities required for job success.',
    points: 20
  },
  {
    id: 'hr_int_005',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is organizational culture?',
    options: ['Company culture events', 'Shared values, beliefs, and practices', 'Cultural diversity', 'Company traditions'],
    correctAnswer: 1,
    explanation: 'Organizational culture encompasses the shared values, beliefs, and practices that shape behavior in a company.',
    points: 20
  },
  {
    id: 'hr_int_006',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is performance management?',
    options: ['Managing performance reviews', 'Ongoing process of improving employee performance', 'Performance monitoring', 'Performance measurement'],
    correctAnswer: 1,
    explanation: 'Performance management is an ongoing process of communication and feedback to improve employee performance.',
    points: 20
  },
  {
    id: 'hr_int_007',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is change management?',
    options: ['Managing spare change', 'Process of helping people adapt to organizational changes', 'Changing management', 'Management changes'],
    correctAnswer: 1,
    explanation: 'Change management is the process of helping individuals and organizations adapt to organizational changes.',
    points: 20
  },
  {
    id: 'hr_int_008',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is workforce planning?',
    options: ['Planning work schedules', 'Strategic planning for future workforce needs', 'Planning workforce events', 'Workforce organization'],
    correctAnswer: 1,
    explanation: 'Workforce planning is the strategic process of analyzing and planning for future workforce needs.',
    points: 20
  },
  {
    id: 'hr_int_009',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is employee development?',
    options: ['Employee growth', 'Process of improving employee skills and capabilities', 'Employee advancement', 'Employee progress'],
    correctAnswer: 1,
    explanation: 'Employee development is the process of improving employee skills, knowledge, and capabilities for current and future roles.',
    points: 20
  },
  {
    id: 'hr_int_010',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is compensation strategy?',
    options: ['Payment strategy', 'Systematic approach to employee compensation', 'Compensation planning', 'Salary strategy'],
    correctAnswer: 1,
    explanation: 'Compensation strategy is a systematic approach to providing monetary and non-monetary rewards to employees.',
    points: 20
  },
  {
    id: 'hr_int_011',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is employer branding?',
    options: ['Company branding', 'Reputation as an employer', 'Brand management', 'Employment marketing'],
    correctAnswer: 1,
    explanation: 'Employer branding is the reputation and image of a company as an employer in the job market.',
    points: 20
  },
  {
    id: 'hr_int_012',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is conflict resolution?',
    options: ['Solving conflicts', 'Process of resolving workplace disputes', 'Conflict management', 'Dispute settlement'],
    correctAnswer: 1,
    explanation: 'Conflict resolution is the process of resolving disputes and disagreements in the workplace.',
    points: 20
  },
  {
    id: 'hr_int_013',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is job analysis?',
    options: ['Analyzing jobs', 'Systematic study of job requirements and characteristics', 'Job evaluation', 'Job assessment'],
    correctAnswer: 1,
    explanation: 'Job analysis is the systematic study of jobs to determine their requirements, duties, and characteristics.',
    points: 20
  },
  {
    id: 'hr_int_014',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is employee wellness?',
    options: ['Employee health', 'Programs promoting employee physical and mental health', 'Employee fitness', 'Employee wellbeing'],
    correctAnswer: 1,
    explanation: 'Employee wellness refers to programs and initiatives that promote employee physical and mental health.',
    points: 20
  },
  {
    id: 'hr_int_015',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    question: 'What is labor relations?',
    options: ['Work relationships', 'Management of relationships with labor unions', 'Employee relations', 'Labor management'],
    correctAnswer: 1,
    explanation: 'Labor relations involves the management of relationships between employers and labor unions.',
    points: 20
  },
  // Human Resources Questions - Advanced Level (15 questions)
  {
    id: 'hr_adv_001',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is strategic human resource management?',
    options: ['Strategic HR planning', 'Aligning HR practices with business strategy', 'HR strategy development', 'Strategic HR decisions'],
    correctAnswer: 1,
    explanation: 'Strategic HRM involves aligning human resource practices with organizational strategy to achieve business objectives.',
    points: 30
  },
  {
    id: 'hr_adv_002',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is predictive analytics in HR?',
    options: ['Predicting HR trends', 'Using data to forecast HR outcomes', 'HR predictions', 'Analytical HR reporting'],
    correctAnswer: 1,
    explanation: 'Predictive analytics in HR uses data and statistical algorithms to forecast future HR outcomes and trends.',
    points: 30
  },
  {
    id: 'hr_adv_003',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is organizational development?',
    options: ['Company development', 'Planned change process to improve organizational effectiveness', 'Organization growth', 'Development planning'],
    correctAnswer: 1,
    explanation: 'Organizational development is a planned change process designed to improve organizational effectiveness and health.',
    points: 30
  },
  {
    id: 'hr_adv_004',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is talent management?',
    options: ['Managing talented people', 'Integrated approach to recruiting, developing, and retaining talent', 'Talent development', 'Talent acquisition'],
    correctAnswer: 1,
    explanation: 'Talent management is an integrated approach to recruiting, developing, managing, and retaining employees.',
    points: 30
  },
  {
    id: 'hr_adv_005',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is human capital management?',
    options: ['Managing human capital', 'Strategic approach to managing people as assets', 'Capital management', 'Human resource management'],
    correctAnswer: 1,
    explanation: 'Human capital management is the strategic approach to managing people as valuable organizational assets.',
    points: 30
  },
  {
    id: 'hr_adv_006',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is workforce analytics?',
    options: ['Analyzing workforce', 'Data-driven approach to understanding workforce patterns', 'Workforce analysis', 'Employee analytics'],
    correctAnswer: 1,
    explanation: 'Workforce analytics uses data and statistical methods to understand and optimize workforce performance.',
    points: 30
  },
  {
    id: 'hr_adv_007',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is digital transformation in HR?',
    options: ['HR digitization', 'Integration of digital technologies into HR processes', 'Digital HR tools', 'HR technology transformation'],
    correctAnswer: 1,
    explanation: 'Digital transformation in HR involves integrating digital technologies to fundamentally change HR processes and experiences.',
    points: 30
  },
  {
    id: 'hr_adv_008',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is agile HR?',
    options: ['Fast HR processes', 'Flexible and responsive HR approach', 'Agile methodology in HR', 'Quick HR decisions'],
    correctAnswer: 1,
    explanation: 'Agile HR is a flexible, responsive approach that adapts quickly to changing business needs and employee expectations.',
    points: 30
  },
  {
    id: 'hr_adv_009',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is people analytics?',
    options: ['Analyzing people', 'Data-driven insights about workforce behavior', 'People analysis', 'Employee analytics'],
    correctAnswer: 1,
    explanation: 'People analytics uses data and statistical methods to gain insights about workforce behavior and performance.',
    points: 30
  },
  {
    id: 'hr_adv_010',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is employee experience design?',
    options: ['Designing employee experiences', 'Strategic approach to creating positive employee journeys', 'Experience design', 'Employee journey design'],
    correctAnswer: 1,
    explanation: 'Employee experience design is the strategic approach to creating positive, meaningful employee journeys.',
    points: 30
  },
  {
    id: 'hr_adv_011',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is inclusive leadership?',
    options: ['Including everyone in leadership', 'Leadership style that leverages diversity', 'Inclusive management', 'Diverse leadership'],
    correctAnswer: 1,
    explanation: 'Inclusive leadership is a leadership style that leverages diversity and creates an environment where all employees can thrive.',
    points: 30
  },
  {
    id: 'hr_adv_012',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is organizational psychology?',
    options: ['Psychology in organizations', 'Study of human behavior in workplace settings', 'Workplace psychology', 'Organizational behavior'],
    correctAnswer: 1,
    explanation: 'Organizational psychology is the study of human behavior, attitudes, and performance in workplace settings.',
    points: 30
  },
  {
    id: 'hr_adv_013',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is total rewards strategy?',
    options: ['Total compensation', 'Comprehensive approach to employee rewards', 'Reward strategy', 'Complete rewards system'],
    correctAnswer: 1,
    explanation: 'Total rewards strategy is a comprehensive approach that includes all forms of employee rewards and recognition.',
    points: 30
  },
  {
    id: 'hr_adv_014',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is future of work?',
    options: ['Future workplace', 'Evolving nature of work and workplace', 'Work trends', 'Future employment'],
    correctAnswer: 1,
    explanation: 'Future of work refers to the evolving nature of work, workplace, and workforce driven by technological and social changes.',
    points: 30
  },
  {
    id: 'hr_adv_015',
    category: 'Human Resources',
    difficulty: 'Advanced',
    question: 'What is HR business partnering?',
    options: ['HR partnerships', 'Strategic collaboration between HR and business units', 'Business HR support', 'HR business alignment'],
    correctAnswer: 1,
    explanation: 'HR business partnering involves strategic collaboration between HR professionals and business units to achieve organizational goals.',
    points: 30
  }
];

// Helper functions
export const getQuestionsByCategory = (category: SkillCategory): QuizQuestion[] => {
  return quizQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: DifficultyLevel): QuizQuestion[] => {
  return quizQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByCategoryAndDifficulty = (
  category: SkillCategory,
  difficulty: DifficultyLevel
): QuizQuestion[] => {
  return quizQuestions.filter(q => q.category === category && q.difficulty === difficulty);
};

export const getRandomQuestions = (
  category: SkillCategory,
  difficulty: DifficultyLevel,
  count: number
): QuizQuestion[] => {
  const filtered = getQuestionsByCategoryAndDifficulty(category, difficulty);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const calculateScore = (answers: (number | null)[], questions: QuizQuestion[]): number => {
  let score = 0;
  answers.forEach((answer, index) => {
    if (answer !== null && answer === questions[index]?.correctAnswer) {
      score += questions[index].points;
    }
  });
  return score;
};

export const getMaxPossibleScore = (questions: QuizQuestion[]): number => {
  return questions.reduce((total, question) => total + question.points, 0);
};

// Achievement definitions
export const achievements = {
  FIRST_QUIZ: 'First Quiz Completed',
  PERFECT_SCORE: 'Perfect Score',
  STREAK_5: '5-Day Streak',
  STREAK_10: '10-Day Streak',
  CATEGORY_MASTER: 'Category Master',
  SPEED_DEMON: 'Speed Demon',
  KNOWLEDGE_SEEKER: 'Knowledge Seeker'
};

export const skillCategories: SkillCategory[] = [
  'Data Science',
  'Marketing',
  'Finance',
  'Software Development',
  'Project Management',
  'Design',
  'Sales',
  'Human Resources'
];

export const difficultyLevels: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
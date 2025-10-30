// Système de traductions pour Vidova

export const translations = {
  fr: {
    // Navigation
    backToDashboard: 'Retour au dashboard',
    settings: 'Paramètres',
    manageAccount: 'Gérez votre compte et vos préférences',
    
    // Tabs
    profile: 'Profil',
    notifications: 'Notifications',
    security: 'Sécurité',
    billing: 'Facturation',
    preferences: 'Préférences',
    apiKeys: 'Clés API',
    contentSettings: 'Contenu',
    
    // Profile
    profileInfo: 'Informations du profil',
    name: 'Nom',
    email: 'Email',
    bio: 'Bio',
    bioPlaceholder: 'Parlez-nous de vous...',
    
    // Notifications
    notificationPreferences: 'Préférences de notifications',
    notificationDescription: 'Gérez comment et quand vous recevez des notifications',
    emailNotifications: 'Notifications email',
    emailNotificationsDesc: 'Recevez des emails pour les mises à jour importantes',
    videoProcessed: 'Vidéo traitée',
    videoProcessedDesc: 'Notification quand une vidéo est prête',
    weeklyDigest: 'Résumé hebdomadaire',
    weeklyDigestDesc: 'Statistiques de vos créations de la semaine',
    newFeatures: 'Nouvelles fonctionnalités',
    newFeaturesDesc: 'Soyez informé des nouvelles fonctionnalités',
    
    // Security
    accountSecurity: 'Sécurité du compte',
    securityDescription: 'Protégez votre compte avec un mot de passe fort',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    minChars: 'Minimum 6 caractères',
    updatePassword: 'Mettre à jour le mot de passe',
    dangerZone: 'Zone de danger',
    deleteAccountWarning: 'Une fois supprimé, votre compte ne peut pas être récupéré.',
    deleteMyAccount: 'Supprimer mon compte',
    
    // Preferences
    customizeExperience: 'Personnalisez votre expérience',
    language: 'Langue',
    theme: 'Thème',
    lightTheme: 'Clair',
    darkTheme: 'Sombre',
    autoTheme: 'Automatique',
    timezone: 'Fuseau horaire',
    dateFormat: 'Format de date',
    
    // API Keys
    apiKeysTitle: 'Clés API',
    apiKeysDescription: 'Gérez vos clés API pour les intégrations',
    geminiApiKey: 'Clé API Google Gemini',
    geminiApiKeyDesc: 'Pour la génération de contenu IA',
    youtubeApiKey: 'Clé API YouTube',
    youtubeApiKeyDesc: 'Pour l\'accès aux données vidéo',
    apiKeyPlaceholder: 'Entrez votre clé API...',
    showApiKey: 'Afficher',
    hideApiKey: 'Masquer',
    
    // Content Settings
    contentSettingsTitle: 'Paramètres de contenu',
    contentSettingsDesc: 'Personnalisez la génération de contenu',
    defaultTone: 'Ton par défaut',
    toneOptions: {
      professional: 'Professionnel',
      casual: 'Décontracté',
      enthusiastic: 'Enthousiaste',
      educational: 'Éducatif'
    },
    contentLength: 'Longueur du contenu',
    lengthOptions: {
      short: 'Court',
      medium: 'Moyen',
      long: 'Long'
    },
    includeEmojis: 'Inclure des emojis',
    includeEmojisDesc: 'Ajouter des emojis dans le contenu généré',
    autoPublish: 'Publication automatique',
    autoPublishDesc: 'Publier automatiquement le contenu généré',
    
    // Billing
    billingAndSubscription: 'Facturation & Abonnement',
    billingDescription: 'Gérez votre plan et vos paiements',
    currentPlan: 'Plan actuel',
    free: 'Gratuit',
    videosPerMonth: 'vidéos / mois',
    viewAllPlans: 'Voir tous les plans',
    upgradeToUnlock: 'Upgrader pour débloquer toutes les fonctionnalités',
    billingHistory: 'Historique de facturation',
    date: 'Date',
    description: 'Description',
    amount: 'Montant',
    status: 'Statut',
    noTransactions: 'Aucune transaction',
    
    // Actions
    save: 'Enregistrer',
    saveChanges: 'Enregistrer les modifications',
    saved: 'Modifications enregistrées !',
    cancel: 'Annuler',
    
    // Errors
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
    connectionError: 'Erreur de connexion au serveur',
    
    // Dashboard
    help: 'Aide',
    logout: 'Quitter',
    yourStudio: 'Votre Studio de Création',
    createAmazingContent: 'Créez du contenu',
    incredibleContent: 'incroyable',
    transformVideos: 'Transformez vos vidéos YouTube en articles de blog, posts sociaux, newsletters et bien plus avec l\'IA.',
    newVideo: 'Nouvelle Vidéo',
    quickGuide: 'Guide rapide',
    myWorkspaces: 'Mes Workspaces',
    create: 'Créer',
    statistics: 'Statistiques',
    searchVideos: 'Rechercher des vidéos par titre ou URL...',
    filters: 'Filtres',
    showing: 'Affichage',
    of: 'de',
    videos: 'vidéos',
    
    // Common
    loading: 'Chargement...',
    loadingTakesLong: 'Si cela prend trop de temps, essayez de rafraîchir la page',
    error: 'Erreur',
    retry: 'Réessayer',
    goToLogin: 'Aller à la connexion',
    
    // Workspace
    workspaceSelect: 'Sélectionnez un workspace',
    workspaceSelectDescription: 'Choisissez un workspace pour commencer à créer du contenu',
    selectWorkspaceStart: 'Sélectionnez un workspace pour commencer',
    
    // Video Filters
    allVideos: 'Toutes les vidéos',
    completed: 'Terminées',
    processing: 'En cours',
    pending: 'En attente',
    failed: 'Échouées',
    filterStatus: 'Statut',
    sortBy: 'Trier par',
    newestFirst: 'Plus récentes',
    oldestFirst: 'Plus anciennes',
    titleAZ: 'Titre A-Z',
    clearAllFilters: 'Effacer tous les filtres',
    
    // Workspace Manager
    createWorkspace: 'Créer le workspace',
    noWorkspace: 'Aucun workspace',
    createOneToStart: 'Créez-en un pour commencer',
    
    // Dashboard Stats
    statsTotalVideos: 'Vidéos totales',
    statsVideosSubmitted: 'vidéos soumises',
    statsProcessing: 'En traitement',
    statsInProgress: 'en cours',
    statsCompleted: 'Terminées',
    statsSuccessRate: 'taux de succès',
    statsContentGenerated: 'Contenu généré',
    statsPerVideo: 'par vidéo',
    dashboardNoVideos: 'Aucune vidéo soumise',
    dashboardYourVideos: 'Vos Vidéos',
    dashboardSubmitFirst: 'Soumettez votre première vidéo',
    dashboardAiPowered: 'Créez du contenu de qualité avec l\'IA',
    filtersVideos: 'vidéos',
    filtersNoMatch: 'Aucune vidéo trouvée',
    filtersTryAdjusting: 'Essayez d\'ajuster vos filtres ou critères de recherche',
    filtersClearFilters: 'Effacer les filtres',
    errorsLoadingVideos: 'Erreur lors du chargement des vidéos',
    
    // Video Actions
    viewDetails: 'Voir les Détails',
    download: 'Télécharger',
    watchOnYoutube: 'Regarder sur YouTube',
    delete: 'Supprimer',
    deleteVideo: 'Supprimer la vidéo ?',
    actionIrreversible: 'Cette action est irréversible.',
    deleting: 'Suppression...',
    
    // Quick Actions
    'quickActions.addVideo': 'Ajouter une vidéo',
    'quickActions.addVideoDesc': 'Importer une nouvelle vidéo',
    'quickActions.viewContent': 'Voir le contenu',
    'quickActions.viewContentDesc': 'Consulter vos contenus',
    'quickActions.exportAll': 'Tout exporter',
    'quickActions.exportAllDesc': 'Télécharger tout',
    'quickActions.settings': 'Paramètres',
    'quickActions.settingsDesc': 'Configurer votre compte',
    'quickActions.documentation': 'Documentation',
    'quickActions.whatsNew': 'Nouveautés',
  },
  
  en: {
    // Navigation
    backToDashboard: 'Back to dashboard',
    settings: 'Settings',
    manageAccount: 'Manage your account and preferences',
    
    // Tabs
    profile: 'Profile',
    notifications: 'Notifications',
    security: 'Security',
    billing: 'Billing',
    preferences: 'Preferences',
    apiKeys: 'API Keys',
    contentSettings: 'Content',
    
    // Profile
    profileInfo: 'Profile information',
    name: 'Name',
    email: 'Email',
    bio: 'Bio',
    bioPlaceholder: 'Tell us about yourself...',
    
    // Notifications
    notificationPreferences: 'Notification preferences',
    notificationDescription: 'Manage how and when you receive notifications',
    emailNotifications: 'Email notifications',
    emailNotificationsDesc: 'Receive emails for important updates',
    videoProcessed: 'Video processed',
    videoProcessedDesc: 'Notification when a video is ready',
    weeklyDigest: 'Weekly digest',
    weeklyDigestDesc: 'Statistics of your weekly creations',
    newFeatures: 'New features',
    newFeaturesDesc: 'Be notified of new features',
    
    // Security
    accountSecurity: 'Account security',
    securityDescription: 'Protect your account with a strong password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    minChars: 'Minimum 6 characters',
    updatePassword: 'Update password',
    dangerZone: 'Danger zone',
    deleteAccountWarning: 'Once deleted, your account cannot be recovered.',
    deleteMyAccount: 'Delete my account',
    
    // Preferences
    customizeExperience: 'Customize your experience',
    language: 'Language',
    theme: 'Theme',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    autoTheme: 'Automatic',
    timezone: 'Timezone',
    dateFormat: 'Date format',
    
    // API Keys
    apiKeysTitle: 'API Keys',
    apiKeysDescription: 'Manage your API keys for integrations',
    geminiApiKey: 'Google Gemini API Key',
    geminiApiKeyDesc: 'For AI content generation',
    youtubeApiKey: 'YouTube API Key',
    youtubeApiKeyDesc: 'For video data access',
    apiKeyPlaceholder: 'Enter your API key...',
    showApiKey: 'Show',
    hideApiKey: 'Hide',
    
    // Content Settings
    contentSettingsTitle: 'Content settings',
    contentSettingsDesc: 'Customize content generation',
    defaultTone: 'Default tone',
    toneOptions: {
      professional: 'Professional',
      casual: 'Casual',
      enthusiastic: 'Enthusiastic',
      educational: 'Educational'
    },
    contentLength: 'Content length',
    lengthOptions: {
      short: 'Short',
      medium: 'Medium',
      long: 'Long'
    },
    includeEmojis: 'Include emojis',
    includeEmojisDesc: 'Add emojis to generated content',
    autoPublish: 'Auto-publish',
    autoPublishDesc: 'Automatically publish generated content',
    
    // Billing
    billingAndSubscription: 'Billing & Subscription',
    billingDescription: 'Manage your plan and payments',
    currentPlan: 'Current plan',
    free: 'Free',
    videosPerMonth: 'videos / month',
    viewAllPlans: 'View all plans',
    upgradeToUnlock: 'Upgrade to unlock all features',
    billingHistory: 'Billing History',
    date: 'Date',
    description: 'Description',
    amount: 'Amount',
    status: 'Status',
    noTransactions: 'No transactions',
    
    // Actions
    save: 'Save',
    saveChanges: 'Save changes',
    saved: 'Changes saved!',
    cancel: 'Cancel',
    
    // Errors
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    connectionError: 'Server connection error',
    
    // Dashboard
    help: 'Help',
    logout: 'Logout',
    yourStudio: 'Your Creative Studio',
    createAmazingContent: 'Create amazing',
    incredibleContent: 'content',
    transformVideos: 'Transform your YouTube videos into blog articles, social posts, newsletters and more with AI.',
    newVideo: 'New Video',
    quickGuide: 'Quick Guide',
    myWorkspaces: 'My Workspaces',
    create: 'Create',
    statistics: 'Statistics',
    searchVideos: 'Search videos by title or URL...',
    filters: 'Filters',
    showing: 'Showing',
    of: 'of',
    videos: 'videos',
    
    // Common
    loading: 'Loading...',
    loadingTakesLong: 'If this takes too long, try refreshing the page',
    error: 'Error',
    retry: 'Retry',
    goToLogin: 'Go to login',
    
    // Workspace
    workspaceSelect: 'Select a workspace',
    workspaceSelectDescription: 'Choose a workspace to start creating content',
    selectWorkspaceStart: 'Select a workspace to get started',
    
    // Video Filters
    allVideos: 'All Videos',
    completed: 'Completed',
    processing: 'Processing',
    pending: 'Pending',
    failed: 'Failed',
    filterStatus: 'Status',
    sortBy: 'Sort By',
    newestFirst: 'Newest First',
    oldestFirst: 'Oldest First',
    titleAZ: 'Title A-Z',
    clearAllFilters: 'Clear all filters',
    
    // Workspace Manager
    createWorkspace: 'Create workspace',
    noWorkspace: 'No workspace',
    createOneToStart: 'Create one to get started',
    
    // Dashboard Stats
    statsTotalVideos: 'Total Videos',
    statsVideosSubmitted: 'videos submitted',
    statsProcessing: 'Processing',
    statsInProgress: 'in progress',
    statsCompleted: 'Completed',
    statsSuccessRate: 'success rate',
    statsContentGenerated: 'Content Generated',
    statsPerVideo: 'per video',
    dashboardNoVideos: 'No videos submitted',
    dashboardYourVideos: 'Your Videos',
    dashboardSubmitFirst: 'Submit your first video',
    dashboardAiPowered: 'Create quality content with AI',
    filtersVideos: 'videos',
    filtersNoMatch: 'No videos found',
    filtersTryAdjusting: 'Try adjusting your filters or search criteria',
    filtersClearFilters: 'Clear filters',
    errorsLoadingVideos: 'Error loading videos',
    
    // Video Actions
    viewDetails: 'View Details',
    download: 'Download',
    watchOnYoutube: 'Watch on YouTube',
    delete: 'Delete',
    deleteVideo: 'Delete video?',
    actionIrreversible: 'This action is irreversible.',
    deleting: 'Deleting...',
    
    // Quick Actions
    'quickActions.addVideo': 'Add video',
    'quickActions.addVideoDesc': 'Import a new video',
    'quickActions.viewContent': 'View content',
    'quickActions.viewContentDesc': 'Check your content',
    'quickActions.exportAll': 'Export all',
    'quickActions.exportAllDesc': 'Download everything',
    'quickActions.settings': 'Settings',
    'quickActions.settingsDesc': 'Configure your account',
    'quickActions.documentation': 'Documentation',
    'quickActions.whatsNew': 'What\'s new',
  }
};

export type Language = 'fr' | 'en';
export type TranslationKey = keyof typeof translations.fr;

export function getTranslation(lang: Language, key: TranslationKey): string {
  const value = translations[lang][key] || translations.fr[key];
  // If value is an object (like toneOptions), return empty string as fallback
  if (typeof value === 'object') {
    return '';
  }
  return (value as string) || key;
}

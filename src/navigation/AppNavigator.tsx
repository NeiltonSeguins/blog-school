import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

// Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import PostsListScreen from '../screens/Posts/PostsListScreen';
import TeachersListScreen from '../screens/Admin/TeachersListScreen';
import StudentsListScreen from '../screens/Admin/StudentsListScreen';
import PostFormScreen from '../screens/Posts/PostFormScreen';
import PostDetailScreen from '../screens/Posts/PostDetailScreen';
import UserFormScreen from '../screens/Shared/UserFormScreen';

// --- Type Definitions ---
export type RootStackParamList = {
  Main: undefined;
  UserForm: { id?: number; userType: 'teacher' | 'student' } | undefined;
  Login: undefined;
};

export type PostStackParamList = {
  PostsList: undefined;
  PostDetail: { id: number };
  PostForm: { id?: number };
};

export type TabParamList = {
  PostsTab: undefined;
  Teachers: undefined;
  Students: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const PostStack = createStackNavigator<PostStackParamList>();

// --- Navigators ---

function PostsStackNavigator() {
  return (
    <PostStack.Navigator id="PostsStack" screenOptions={{ headerShown: false }}>
       <PostStack.Screen name="PostsList" component={PostsListScreen} />
       <PostStack.Screen name="PostDetail" component={PostDetailScreen} />
       <PostStack.Screen name="PostForm" component={PostFormScreen} />
    </PostStack.Navigator>
  );
}

function AdminTabs() {
  const { user } = useAuth();
  const isProfessor = user?.role === 'professor';

  return (
    <Tab.Navigator
      id="AdminTabs"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
      }}
    >
      <Tab.Screen 
        name="PostsTab" 
        component={PostsStackNavigator} 
        options={{ title: 'Posts' }}
      />
      
      {isProfessor && (
        <Tab.Screen 
          name="Teachers" 
          component={TeachersListScreen} 
          options={{ title: 'Professores' }}
        />
      )}
      {isProfessor && (
        <Tab.Screen 
          name="Students" 
          component={StudentsListScreen} 
          options={{ title: 'Alunos' }}
        />
      )}
    </Tab.Navigator>
  );
}

function AuthStack() {
  const AuthStackDef = createStackNavigator();
  return (
    <AuthStackDef.Navigator id="AuthStack" screenOptions={{ headerShown: false }}>
      <AuthStackDef.Screen name="Login" component={LoginScreen} />
    </AuthStackDef.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator id="AppStack" screenOptions={{ headerShown: false }}>
       <Stack.Screen name="Main" component={AdminTabs} />
       <Stack.Screen name="UserForm" component={UserFormScreen} options={{ headerShown: true, title: 'Editar Usuário' }} />
    </Stack.Navigator>
  );
}

function NavigationRoot() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {signed ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
      <NavigationRoot />
  );
}

import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

// Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import PostsListScreen from '../screens/Posts/PostsListScreen';
import PostFormScreen from '../screens/Posts/PostFormScreen';
import PostDetailScreen from '../screens/Posts/PostDetailScreen';
import UserFormScreen from '../screens/Shared/UserFormScreen';

import ProfileScreen from '../screens/Shared/ProfileScreen';
import UsersListScreen from '../screens/Admin/UsersListScreen';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

// --- Definição de tipos ---
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
  HomeTab: undefined;
  Teachers: { role: 'teacher' };
  Students: { role: 'student' };
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const PostStack = createStackNavigator<PostStackParamList>();

// --- Navegadores ---

function PostsStackNavigator() {
  return (
    <PostStack.Navigator id="PostsStack" screenOptions={{ headerShown: false }}>
      <PostStack.Screen name="PostsList" component={PostsListScreen} />
      <PostStack.Screen name="PostDetail" component={PostDetailScreen} />
      <PostStack.Screen name="PostForm" component={PostFormScreen} />
    </PostStack.Navigator>
  );
}

function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'HomeTab') {
            iconName = 'house';
          } else if (route.name === 'Teachers') {
            iconName = 'chalkboard-user';
          } else if (route.name === 'Students') {
            iconName = 'graduation-cap';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else {
            iconName = 'circle-question';
          }

          return <FontAwesome6 name={iconName as any} size={size} color={color} iconStyle="solid" />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={PostsStackNavigator}
        options={{ title: 'Home' }}
      />

      {user?.role === 'teacher' && (
        <Tab.Screen
          name="Teachers"
          component={UsersListScreen}
          initialParams={{ role: 'teacher' }}
          options={{ title: 'Lista de Professores' }}
        />
      )}

      {user?.role === 'teacher' && (
        <Tab.Screen
          name="Students"
          component={UsersListScreen}
          initialParams={{ role: 'student' }}
          options={{ title: 'Lista de Alunos' }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
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
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="UserForm" component={UserFormScreen} options={{ headerShown: true, title: 'Editar' }} />
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

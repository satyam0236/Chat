import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';

import {Colors} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

type ChatResponse = {
  chats: Chat[];
  from: string;
  to: string;
  name: string;
  status: string;
  message: string;
};

type Chat = {
  id: string;
  message: string;
  sender: {
    image: string;
    is_kyc_verified: boolean;
    self: boolean;
    user_id: string;
  };
  time: string;
};

function App(): React.JSX.Element {

 // console.log('Chat App UI');

  const [chatData, setChatData] = useState<ChatResponse | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  useEffect(() => {
    fetchChatData();
  }, []);

  const fetchChatData = async () => {
    try {
      const response = await fetch(
        'https://qa.corider.in/assignment/chat?page=0',
      );
      const data = await response.json();
      setChatData(data);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  };

  const handleOutsideClick = () => {
    if (showAttachmentMenu) {
      setShowAttachmentMenu(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip 1</Text>
      </View>
      <TouchableOpacity>
        <MaterialCommunityIcons
          name="square-edit-outline"
          size={24}
          color="#000"
        />
      </TouchableOpacity>
    </View>
  );

  const renderTripInfo = () => (
    <View style={styles.tripInfo}>
      <View style={styles.tripHeader}>
        <View style={styles.groupImageContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1569617084133-26942bb441f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
            style={styles.groupImage}
          />
        </View>
        <View style={styles.tripDetails}>
          <View>
            <View style={styles.locationRow}>
              <Text style={styles.fromToLabel}>From</Text>
              <Text style={styles.locationText}>IGI Airport, T3</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.fromToLabel}>To</Text>
              <Text style={styles.locationText}>Sector 28</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMessage = ({item}: {item: Chat}) => (
    <>
      <View
        style={[
          styles.messageContainer,
          item.sender.self ? styles.selfMessage : styles.otherMessage,
        ]}>
        {!item.sender.self && (
          <Image source={{uri: item.sender.image}} style={styles.avatar} />
        )}
        <View
          style={[
            styles.messageContent,
            item.sender.self
              ? styles.selfMessageContent
              : styles.otherMessageContent,
          ]}>
          <Text
            style={[
              styles.messageText,
              item.sender.self && styles.selfMessageText,
            ]}>
            {item.message}
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleOutsideClick}
        style={styles.headerContainer}>
        {renderHeader()}
        {renderTripInfo()}
      </TouchableOpacity>

      <FlatList
        ListHeaderComponent={() => (
          <View style={styles.dateHeader}>
            <View style={styles.dateLine} />
            <Text style={styles.dateText}>12 JAN, 2024</Text>
            <View style={styles.dateLine} />
          </View>
        )}
        data={chatData?.chats}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.chatList}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Reply to @Rohit Yadav"
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            style={styles.attachmentIcon}
            onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}>
            <Feather name="paperclip" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton}>
            <MaterialCommunityIcons name="send" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {showMenu && (
        <TouchableOpacity
          style={[styles.menuOverlay, {position: 'absolute'}]}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}>
          <View style={styles.menuContent}>
            <TouchableOpacity style={styles.menuItem}>
              <MaterialIcons name="people-outline" size={24} color="#000" />
              <Text style={styles.menuItemText}>Members</Text>
            </TouchableOpacity>
            <View style={styles.menuSeparator} />
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="phone" size={24} color="#000" />
              <Text style={styles.menuItemText}>Share Number</Text>
            </TouchableOpacity>
            <View style={styles.menuSeparator} />
            <TouchableOpacity style={styles.menuItem}>
              <Octicons name="report" size={24} color="#000" />
              <Text style={styles.menuItemText}>Report</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {showAttachmentMenu && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.attachmentMenuOverlay}
          onPress={() => setShowAttachmentMenu(false)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
            style={styles.attachmentMenu}>
            <View style={styles.attachmentBubble}>
              <TouchableOpacity style={styles.attachmentIcon}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentIcon}>
                <MaterialCommunityIcons
                  name="video-outline"
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentIcon}>
                <MaterialCommunityIcons
                  name="file-download-outline"
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <View style={styles.attachmentBubbleIndicator} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  tripInfo: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  groupImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  tripDetails: {
    flex: 1,
  },
  locationRow: {
    marginBottom: 4,
    flexDirection: 'row',
  },
  fromToLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    marginRight: 10,
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#141E0D',
  },
  menuButton: {
    padding: 4,
    marginLeft: 8,

  },
  chatList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  selfMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  messageContent: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '75%',
  },
  selfMessageContent: {
    backgroundColor: '#1C63D5',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  otherMessageContent: {
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  inputContainer: {
    padding: 8,
    backgroundColor: '#F2F2F2',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 45,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
  },
  sendButton: {
    marginLeft: 8,
    marginRight: 8,
  },
  attachmentIcon: {
    marginHorizontal: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  groupImage: {
    width: '100%',
    height: '100%',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  menuContent: {
    position: 'absolute',
    top: 110,
    right: 25,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 8,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  },
  selfMessageText: {
    color: '#FFFFFF',
  },
  attachmentMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  attachmentMenu: {
    position: 'absolute',
    bottom: 70,
    right: 16,
    zIndex: 1000,
  },
  menuSeparator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: -8,
  },
  attachmentBubble: {
    flexDirection: 'row',
    backgroundColor: '#006B06',
    borderRadius: 30,
    padding: 16,
    gap: 4,
    position: 'relative', // Add this
  },

  // Add this new style
  attachmentBubbleIndicator: {
    position: 'absolute',
    bottom: -10,
    right: 55,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#006B06',
  },
});

export default App;

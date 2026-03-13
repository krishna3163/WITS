import React, { useState, useCallback } from 'react';
import { useShake } from '../../hooks/useShake';
import { Smartphone, Search, WifiOff } from 'lucide-react';
import classNames from 'classnames';

// Mock data for found users - in a real app, this would come from an API
const MOCK_USERS = [
  { id: 1, name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 2, name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { id: 3, name: 'Alex Ray', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
  { id: 4, name: 'Sarah Bell', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];

type User = {
  id: number;
  name: string;
  avatar: string;
};

const ShakeToFind = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [foundUsers, setFoundUsers] = useState<User[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const performSearch = () => {
    setIsSearching(true);
    setFoundUsers([]);
    setSearchAttempted(true);

    // Simulate API call
    setTimeout(() => {
      // Randomly decide if the search finds users or not
      const isSuccessful = Math.random() > 0.3; // 70% chance of success
      if (isSuccessful) {
        setFoundUsers(MOCK_USERS);
      }
      setIsSearching(false);
    }, 2500); // Simulate network latency
  };

  useShake(performSearch);

  const renderContent = () => {
    if (isSearching) {
      return (
        <div className="text-center">
            <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                    <Search className="text-white" size={32} />
                </div>
            </div>
          <h3 className="text-xl font-bold mt-6">Searching for others...</h3>
        </div>
      );
    }

    if (searchAttempted) {
        if (foundUsers.length > 0) {
            return (
                <div className="w-full max-w-sm mx-auto animate-in">
                    <h3 className="text-xl font-bold text-center mb-4">Found {foundUsers.length} people!</h3>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 space-y-2">
                        {foundUsers.map(user => (
                            <div key={user.id} className="flex items-center gap-4 bg-white/10 p-3 rounded-xl">
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                                <span className="font-bold text-lg">{user.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="text-center animate-in">
                    <WifiOff size={48} className="mx-auto text-white/50" />
                    <h3 className="text-xl font-bold mt-4">Nothing to report</h3>
                    <p className="text-white/70 mt-1">Couldn't find anyone nearby. Try again!</p>
                </div>
            );
        }
    }


    return (
      <div className="text-center">
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className={classNames(
              "relative transition-transform duration-300 ease-in-out",
            )}>
              <Smartphone size={80} strokeWidth={1.5} className="mx-auto" />
            </div>
        </div>
        <h2 className="text-2xl font-bold mt-8">Shake to Find</h2>
        <p className="text-sm text-white/70 mt-2">Find others who are shaking their devices now</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-blue-400 to-indigo-600 text-white overflow-hidden p-4">
        {renderContent()}

        <button 
            onClick={performSearch}
            className="fixed bottom-10 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-full z-10 transition-all active:scale-95"
        >
            Simulate Shake
        </button>
    </div>
  );
};

export default ShakeToFind;

import { useState, useEffect } from "react";
import { Image, ScrollView, Text, View, Alert } from "react-native";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

const CreatePassword = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // If the user is loaded and already has a password, skip this screen
    if (isLoaded && user?.passwordEnabled) {
      router.replace("/(root)/(tabs)/home");
    }
  }, [isLoaded, user, router]);

  const onSavePress = async () => {
    if (!isLoaded || !user) return;
    
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    setIsSaving(true);
    try {
      await user.updatePassword({ newPassword: password });
      Alert.alert("Success", "Password created successfully!");
      router.replace("/(root)/(tabs)/home");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0]?.longMessage || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const onSkipPress = () => {
    router.replace("/(root)/(tabs)/home");
  };

  // Prevent flashing the UI if we are about to redirect
  if (!isLoaded || user?.passwordEnabled) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Set a Password
          </Text>
        </View>
        <View className="p-5">
          <Text className="font-Jakarta mb-5 text-gray-500">
            You signed in with Google. Create a password so you can also log in manually using your email address.
          </Text>
          
          <InputField
            label="New Password"
            placeholder="Enter a secure password"
            icon={icons.lock}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <CustomButton
            title={isSaving ? "Saving..." : "Save Password"}
            onPress={onSavePress}
            className="mt-6"
          />
          
          <CustomButton
            title="Skip for now"
            onPress={onSkipPress}
            bgVariant="outline"
            textVariant="primary"
            className="mt-4"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreatePassword;

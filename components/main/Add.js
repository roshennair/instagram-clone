import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [camera, setCamera] = useState(null);
	const [image, setImage] = useState(null);

	useEffect(() => {
		(async () => {
			const { status: cameraStatus } = await Camera.requestPermissionsAsync();
			setHasCameraPermission(cameraStatus === 'granted');

			const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			setHasGalleryPermission(galleryStatus === 'granted');
		})();
	}, []);

	const takePicture = async () => {
		if (camera) {
			let photo = await camera.takePictureAsync(null);
			setImage(photo.uri);
		}
	}

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	if (hasCameraPermission === null || hasGalleryPermission === null) {
		return <View />;
	}
	if (hasCameraPermission === false || hasGalleryPermission === false) {
		return <Text>No access to camera</Text>;
	}
	return (
		<View style={{ flex: 1 }}>
			<View style={styles.cameraContainer}>
				<Camera
					ref={el => setCamera(el)}
					type={type}
					style={styles.fixedRatio}
					ratio="1:1" />
			</View>
			<Button
				title="Flip Camera"
				onPress={() => {
					setType(
						type === Camera.Constants.Type.back
							? Camera.Constants.Type.front
							: Camera.Constants.Type.back
					);
				}} />
			<Button
				title="Take Picture"
				onPress={takePicture} />
			<Button
				title="Pick Image from Gallery"
				onPress={pickImage} />
			{image && <Image
				source={{ uri: image }}
				style={{ flex: 1 }} />}
		</View>
	);
}

const styles = StyleSheet.create({
	cameraContainer: {
		flex: 1,
		flexDirection: 'row'
	},
	fixedRatio: {
		flex: 1,
		aspectRatio: 1
	}
});
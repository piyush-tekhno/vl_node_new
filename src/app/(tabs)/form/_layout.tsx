import { Stack } from "expo-router";


export default function FormLayout (){

    return(
        <Stack>
            <Stack.Screen
                name = "form"
                 options={{ 
          title: 'Form',
          presentation : "card",
          animation : "slide_from_right",
          headerShown: false 
        }} 
      />
        
        </Stack>
    )


}
import SetupProfileForm from './setup-profile-form'

export default function SetupProfilePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">환영합니다!</h1>
          <p className="text-muted-foreground mt-2">프로필 설정을 마치고 서비스를 이용해보세요.</p>
        </div>
        <SetupProfileForm />
      </div>
    </div>
  )
}


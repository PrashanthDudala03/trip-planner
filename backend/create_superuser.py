import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Check if superadmin exists
try:
    user = User.objects.get(username='superadmin')
    print(f'✅ User "superadmin" exists')
    # Reset password
    user.set_password('admin123')
    user.is_superuser = True
    user.is_staff = True
    user.is_active = True
    user.save()
    print(f'✅ Password reset to: admin123')
except User.DoesNotExist:
    # Create new superuser
    user = User.objects.create_superuser(
        username='superadmin',
        email='admin@example.com',
        password='admin123'
    )
    print(f'✅ Superuser created: superadmin / admin123')

print(f'\n📋 User Details:')
print(f'   Username: {user.username}')
print(f'   Email: {user.email}')
print(f'   Is Superuser: {user.is_superuser}')
print(f'   Is Staff: {user.is_staff}')
print(f'   Is Active: {user.is_active}')

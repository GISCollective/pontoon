# Generated by Django 3.2.24 on 2024-03-08 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0053_alter_translation_index_together"),
    ]

    operations = [
        migrations.AddField(
            model_name="resource",
            name="order",
            field=models.PositiveIntegerField(default=0),
        ),
    ]

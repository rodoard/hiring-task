import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Index, JoinColumn } from "typeorm";
import { CoreEntity } from "./core.entity";
import { TodoEntity } from "./todo.entity";

@Entity("user")
export class UserEntity extends CoreEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid;
  
  @Column({ type: "varchar", nullable: true })
  username;
  
  @Column({ type: "varchar", nullable: false })
  @Index({ unique: true })
  email;
  
  @Column({ type: "varchar", nullable: false })
  password;

  @OneToMany(() => TodoEntity, (todo) => todo.user)
  todos: TodoEntity[];
}
